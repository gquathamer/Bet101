require('dotenv/config');
const express = require('express');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const ClientError = require('./client-error');
const checkPassword = require('./check-password');
const checkDeposit = require('./check-deposit');

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
      RETURNING "userId", "userName", "createdAt", "initialDeposit"
      `;
      return db.query(sql, params);
    })
    .then(dbResponse => {
      const newUser = dbResponse.rows[0];
      res.status(201).json({
        userName: newUser.userName,
        userId: newUser.userId,
        createdAt: newUser.createdAt,
        initialDepost: newUser.initialDeposit
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
    SELECT "userName", "userId", "hashedPassword"
    FROM "users"
    WHERE "userName" = $1
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const user = dbResponse.rows[0];
      if (!user) {
        throw new ClientError(401, 'invalid username');
      }
      const { userName, userId, hashedPassword } = user;
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
            jsonSignedToken
          });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

/* app.get('/api/account-balance', (req, res, next) => {
  const decoded = jwt.decode(req.get('x-access-token'));
  if (!decoded.userId) {
    throw new ClientError(400, 'could not find user information in request');
  }
  const params = [decoded.userId];
  const sql = `
    SELECT *
    FROM "bets"
    WHERE "bets"."userId" = ($1)
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const userBets = dbResponse.rows;
      res.status(200).json(userBets);
    })
    .catch(err => next(err));
}); */

function calculateSpreadWinner(gameData, winningTeam, betPoints) {
  const selectedWinnerIndex = gameData.scores.findIndex(elem => elem.name === winningTeam);
  let opponentIndex;
  selectedWinnerIndex === 0 ? opponentIndex = 1 : opponentIndex = 0;
  if (parseInt(gameData.scores[selectedWinnerIndex].score) + betPoints > parseInt(gameData.scores[opponentIndex].score)) {
    return 'won';
  } else if (parseInt(gameData.scores[selectedWinnerIndex].score) + betPoints === parseInt(gameData.scores[opponentIndex].score)) {
    return 'tied';
  } else {
    return 'lost';
  }
}

function calculateMoneylineWinner(gameData, winningTeam) {
  const selectedWinnerIndex = gameData.scores.findIndex(elem => elem.name === winningTeam);
  let opponentIndex;
  selectedWinnerIndex === 0 ? opponentIndex = 1 : opponentIndex = 0;
  if (parseInt(gameData.scores[selectedWinnerIndex].score) > parseInt(gameData.scores[opponentIndex].score)) {
    return 'won';
  } else if (parseInt(gameData.scores[selectedWinnerIndex].score) === parseInt(gameData.scores[opponentIndex].score)) {
    return 'tie';
  } else {
    return 'lost';
  }
}

function calculateTotalWinner(gameData, winningTeam, betPoints) {
  if (winningTeam === 'over' && parseInt(gameData.scores[0].score) + parseInt(gameData.scores[1].score) > parseFloat(betPoints)) {
    return 'won';
  } else if (winningTeam === 'under' && parseInt(gameData.scores[0].score) + parseInt(gameData.scores[1].score) < parseFloat(betPoints)) {
    return 'won';
  } else if (parseInt(gameData.scores[0].score) + parseInt(gameData.scores[1].score) === parseFloat(betPoints)) {
    return 'tied';
  } else {
    return 'lost';
  }
}

function increaseAccountBalance(userId, betAmount, potentialWinnings, next) {
  const params = [userId];
  const sql = `
    SELECT "initialDeposit", "userId"
    FROM "users"
    WHERE "userId" = ($1)
  `;
  db.query(sql, params)
    .then(dbResponse => dbResponse.rows[0])
    .then(userRecord => {
      // change this line so it's always turning the addition of the inputs to an integer
      // I think one of these values is turning into a string
      const params = [parseFloat(userRecord.initialDeposit) + parseInt(betAmount) + parseFloat(potentialWinnings), userRecord.userId];
      const sql = `
        UPDATE "users"
        SET "initialDeposit" = ($1)
        WHERE "userId" = ($2)
      `;
      db.query(sql, params)
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

function subtractAccountBalance(userId, betAmount, next) {
  const params = [userId];
  const sql = `
    SELECT "initialDeposit", "userId"
    FROM "users"
    WHERE "userId" = ($1)
  `;
  db.query(sql, params)
    .then(dbResponse => dbResponse.rows[0])
    .then(userRecord => {
      const params = [parseFloat(userRecord.initialDeposit - betAmount), userRecord.userId];
      const sql = `
        UPDATE "users"
        SET "initialDeposit" = ($1)
        WHERE "userId" = ($2)
      `;
      db.query(sql, params)
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

function updateBetStatus(betId, betStatus, next) {
  const params = [betId, betStatus];
  const sql = `
    UPDATE "bets"
    SET "status" = ($2)
    WHERE "betId" = ($1)
  `;
  db.query(sql, params)
    .catch(err => next(err));
}

app.post('/api/place-bet', (req, res, next) => {
  const { gameId, winningTeam, homeTeam, awayTeam, betAmount, betOdds, betPoints, betType, potentialWinnings, userId, gameStart, sportType } = req.body;
  for (const prop in req.body) {
    if (!prop) {
      throw new ClientError(400, `${prop} is a required field`);
    }
  }
  const date = new Date();
  if (gameStart < date.toISOString()) {
    throw new ClientError(400, 'Cannot place a bet for a live game, or game that has completed!');
  }
  function retrieveGameData(placedBet, checkTime) {
    setTimeout(() => {
      fetch(`https://api.the-odds-api.com/v4/sports/${placedBet.sportType}/scores?apiKey=${process.env.API_KEY}&daysFrom=3`)
        .then(response => response.json())
        .then(apiResponse => {
          const game = apiResponse.find(elem => elem.id === placedBet.gameId);
          if (game === undefined) {
            retrieveGameData(placedBet, 1800000);
          } else if (!game.completed) {
            retrieveGameData(placedBet, 1800000);
          } else if (game.completed && betType === 'spread') {
            const betResult = calculateSpreadWinner(game, winningTeam, betPoints);
            if (betResult === 'won') {
              increaseAccountBalance(userId, betAmount, potentialWinnings, next);
            } else if (betResult === 'tied') {
              increaseAccountBalance(userId, betAmount, 0, next);
            }
            updateBetStatus(placedBet.betId, betResult, next);
          } else if (game.completed && betType === 'moneyline') {
            const betResult = calculateMoneylineWinner(game, winningTeam);
            if (betResult === 'won') {
              increaseAccountBalance(userId, betAmount, 0, next);
            } else if (betResult === 'tied') {
              increaseAccountBalance(userId, betAmount, 0, next);
            }
            updateBetStatus(placedBet.betId, betResult, next);
          } else if (game.completed && betType === 'total') {
            const betResult = calculateTotalWinner(game, winningTeam, betPoints);
            if (betResult === 'won') {
              increaseAccountBalance(userId, betAmount, potentialWinnings, next);
            } else if (betResult === 'tied') {
              increaseAccountBalance(userId, betAmount, 0, next);
            }
            updateBetStatus(placedBet.betId, betResult, next);
          }
        })
        .catch(err => next(err));
    }, checkTime, sportType, checkTime, gameId);
  }
  const status = 'pending';
  const params = [gameId, betAmount, betType, status, userId, gameStart, sportType];
  const sql = `
    INSERT INTO "bets" ("gameId", "betAmount", "betType", "status", "userId", "gameStart", "sportType")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const placedBet = dbResponse.rows[0];
      retrieveGameData(placedBet, placedBet.gameStart - placedBet.createdAt + 10800000);
      return placedBet;
    })
    .then(placedBet => {
      let params, columns, betTypeTable, values;
      if (betType === 'spread') {
        betTypeTable = 'spreadBets';
        params = [winningTeam, homeTeam, awayTeam, betOdds, betPoints, potentialWinnings, placedBet.betId, placedBet.userId];
        columns = '"winningTeam", "homeTeam", "awayTeam", "price", "points", "potentialWinnings", "betId", "userId"';
        values = '($1, $2, $3, $4, $5, $6, $7, $8)';
      } else if (betType === 'moneyline') {
        betTypeTable = 'moneylineBets';
        params = [winningTeam, homeTeam, awayTeam, betOdds, potentialWinnings, placedBet.betId, placedBet.userId];
        columns = '"winningTeam", "homeTeam", "awayTeam", "price", "potentialWinnings", "betId", "userId"';
        values = '($1, $2, $3, $4, $5, $6, $7)';
      } else {
        betTypeTable = 'totals';
        params = [winningTeam, homeTeam, awayTeam, betOdds, betPoints, potentialWinnings, placedBet.betId, placedBet.userId];
        columns = '"type", "homeTeam", "awayTeam", "price", "points", "potentialWinnings", "betId", "userId"';
        values = '($1, $2, $3, $4, $5, $6, $7, $8)';
      }
      const sql = `
        INSERT INTO "${betTypeTable}" (${columns})
        VALUES ${values}
        RETURNING *
      `;
      db.query(sql, params)
        .then(placedBetDetail => {
          const betDetail = placedBetDetail.rows[0];
          res.status(201).json(betDetail);
        })
        .catch(err => next(err));
      return placedBet;
    })
    .then(placedBet => {
      subtractAccountBalance(userId, placedBet.betAmount, next);
    })
    .catch(err => next(err));
});

app.patch('/api/deposit', (req, res, next) => {
  let { deposit } = req.body;
  if (!deposit) {
    throw new ClientError(400, 'deposit amount is required');
  }
  deposit = Number(req.body.deposit);
  const userId = Number(req.user.userId);
  if (checkDeposit(deposit) !== true) {
    const depositError = checkDeposit(deposit);
    throw new ClientError(400, `invalid deposit: ${depositError}`);
  }
  const params = [deposit, userId];
  const sql = `
    UPDATE "users"
    SET "initialDeposit" = $1
    WHERE "userId" = $2
    RETURNING "initialDeposit", "userName"
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const { initialDeposit, userName } = dbResponse.rows[0];
      res.status(200).json({
        success: `$${initialDeposit} was deposited to user ${userName}!`
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
