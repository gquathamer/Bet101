require('dotenv/config');
const express = require('express');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const ClientError = require('./client-error');
const checkPassword = require('./utility-functions/check-password');
const checkDeposit = require('./utility-functions/check-deposit');
const subtractAccountBalance = require('./utility-functions/subtract-account-balance');
const retrieveGameData = require('./utility-functions/retrieve-game-data');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

app.use(express.json());

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  if (username.length < 6) {
    throw new ClientError(400, 'username must be longer than 5 characters');
  }
  if (checkPassword(password) !== true) {
    const passwordError = checkPassword(password);
    throw new ClientError(400, `password invalid: ${passwordError}`);
  }
  argon2.hash(password)
    .then(hashedPassword => {
      const params = [username, hashedPassword];
      const sql = `
      INSERT INTO "users" ("userName", "hashedPassword")
      VALUES ($1, $2)
      RETURNING "userId", "userName", "createdAt", "accountBalance"
      `;
      return db.query(sql, params);
    })
    .then(dbResponse => {
      const params = [dbResponse.rows[0].userId, parseFloat(dbResponse.rows[0].accountBalance)];
      const sql = `
        INSERT INTO "deposits" ("userId", "depositAmount")
        VALUES ($1, $2)
      `;
      db.query(sql, params);
      return dbResponse;
    })
    .then(dbResponse => {
      const newUser = dbResponse.rows[0];
      res.status(201).json({
        userName: newUser.userName,
        userId: newUser.userId,
        createdAt: newUser.createdAt,
        accountBalance: newUser.accountBalance
      });
    })
    .catch(err => next(err));
});

app.post('/api/auth/log-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const params = [username];
  const sql = `
    SELECT "userName", "userId", "hashedPassword", "accountBalance"
    FROM "users"
    WHERE "userName" = $1
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const user = dbResponse.rows[0];
      if (!user) {
        throw new ClientError(401, 'invalid username');
      }
      const { userName, userId, hashedPassword, accountBalance } = user;
      argon2.verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid password');
          }
          const payload = {
            userName,
            userId
          };
          const jsonSignedToken = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.status(200).json({
            user: payload,
            jsonSignedToken,
            accountBalance
          });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.get('/api/account-balance', (req, res, next) => {
  const decoded = jwt.decode(req.get('x-access-token'));
  if (!decoded.userId) {
    throw new ClientError(400, 'could not find user information in request');
  }
  const params = [decoded.userId];
  const sql = `
    SELECT "accountBalance"
    FROM "users"
    WHERE "userId" = ($1)
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const userAccountBalance = dbResponse.rows[0];
      res.status(200).json(userAccountBalance);
    })
    .catch(err => next(err));
});

app.get('/api/bet-history', (req, res, next) => {
  const decoded = jwt.decode(req.get('x-access-token'));
  if (!decoded.userId) {
    throw new ClientError(400, 'could not find user information in request, invalid token');
  }
  const betParams = [decoded.userId];
  const betSQL = `
    SELECT *
    FROM "bets"
    WHERE "bets"."userId" = $1
    ORDER BY "bets"."createdAt" DESC
  `;
  let historyArray = [];
  db.query(betSQL, betParams)
    .then(betResponse => {
      historyArray = historyArray.concat(betResponse.rows);
      const depositParams = [decoded.userId];
      const depositSQL = `
        SELECT *
        FROM "deposits"
        WHERE "deposits"."userId" = $1
        ORDER BY "deposits"."createdAt" DESC
      `;
      return db.query(depositSQL, depositParams);
    })
    .then(depositResponse => {
      historyArray = historyArray.concat(depositResponse.rows);
      historyArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      // const betHistory = historyArray;
      res.status(200).json(historyArray);
    })
    .catch(err => next(err));
});

app.post('/api/place-bet', (req, res, next) => {
  const { awayTeam, betAmount, betOdds, betPoints, betType, gameId, gameStart, homeTeam, potentialWinnings, sport, winningTeam } = req.body;
  const decoded = jwt.decode(req.get('x-access-token'));
  const userId = decoded.userId;
  const accountBalanceParams = [userId];
  const accountBalanceSQL = `
    SELECT "accountBalance"
    FROM "users"
    WHERE "userId" = ($1)
  `;
  db.query(accountBalanceSQL, accountBalanceParams)
    .then(dbResponse => {
      const accountBalance = parseFloat(dbResponse.rows[0].accountBalance);
      if (betAmount > accountBalance) {
        throw new ClientError(400, 'Bet amount cannot exceed account balance!');
      }
    })
    .catch(err => next(err));
  const date = new Date(gameStart);
  if (Date.now() > date.getTime()) {
    throw new ClientError(400, 'Cannot place a bet for a live game, or game that has completed!');
  }
  if (betAmount < 1) {
    throw new ClientError(400, 'Bet amount cannot be less than 1');
  }
  const status = 'pending';
  const params = [gameId, parseInt(betAmount), betType, status, userId, gameStart, sport, winningTeam, homeTeam, awayTeam, betOdds, betPoints, potentialWinnings];
  const sql = `
    INSERT INTO "bets" ("gameId", "betAmount", "betType", "status", "userId", "gameStart", "sportType", "winningTeam", "homeTeam", "awayTeam", "price", "points", "potentialWinnings")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const placedBet = dbResponse.rows[0];
      const gameStart = new Date(placedBet.gameStart);
      const checkTime = gameStart.getTime() + 10800000;
      retrieveGameData(db, placedBet, checkTime, next);
      return placedBet;
    })
    .then(placedBet => {
      subtractAccountBalance(db, userId, placedBet.betAmount, next)
        .then(newAccountBalance => {
          placedBet.accountBalance = parseFloat(newAccountBalance);
          res.status(201).json(placedBet);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.patch('/api/deposit', (req, res, next) => {
  const { depositAmount } = req.body;
  const decoded = jwt.decode(req.get('x-access-token'));
  const userId = decoded.userId;
  const lastDepositParams = [userId];
  const lastDepositSQL = `
    SELECT "lastDeposit", "accountBalance"
    FROM "users"
    WHERE "userId" = $1
  `;
  db.query(lastDepositSQL, lastDepositParams)
    .then(dbResponse => {
      const { accountBalance } = dbResponse.rows[0];
      const placedDate = new Date(dbResponse.rows[0].lastDeposit);
      const currentTime = new Date();
      if ((currentTime.getTime() - placedDate.getTime() < 60 * 60 * 24 * 1000)) {
        throw new ClientError(400, 'Only one deposit can be made in a 24 hour period');
      }
      const validDeposit = checkDeposit(depositAmount, accountBalance);
      if (!validDeposit) {
        const depositError = checkDeposit(depositAmount, accountBalance);
        throw new ClientError(400, `${depositError}`);
      }
      const params = [parseFloat(depositAmount) + parseFloat(accountBalance), userId, currentTime];
      const sql = `
        UPDATE "users"
        SET "accountBalance" = $1,
            "lastDeposit" = $3
        WHERE "userId" = $2
        RETURNING "accountBalance", "userName", "lastDeposit", "userId"
      `;
      return db.query(sql, params);
    })
    .then(dbResponse => {
      const { userId } = dbResponse.rows[0];
      const params = [depositAmount, userId];
      const sql = `
        INSERT INTO "deposits" ("depositAmount", "userId")
        VALUES ($1, $2)
      `;
      db.query(sql, params);
      return dbResponse;
    })
    .then(dbResponse => {
      const { accountBalance, userName, lastDeposit } = dbResponse.rows[0];
      res.status(200).json({
        success: `${userName}'s new account balance is ${accountBalance} with last deposit on ${lastDeposit}!`,
        accountBalance: parseFloat(accountBalance)
      });
    })
    .catch(err => next(err));
});

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
