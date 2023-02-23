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
      RETURNING "userId", "userName", "createdAt", "accountBalance"
      `;
      return db.query(sql, params);
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
    throw new ClientError(400, 'could not find user information in request');
  }
  const params = [decoded.userId];
  const sql = `
    SELECT *
    FROM "bets"
    WHERE "bets"."userId" = $1
    ORDER BY "bets"."createdAt" DESC
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const betHistory = dbResponse.rows;
      res.status(200).json(betHistory);
    })
    .catch(err => next(err));
});

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
  if (winningTeam === 'over' && parseInt(gameData.scores[0].score) + parseInt(gameData.scores[1].score) > betPoints) {
    return 'won';
  } else if (winningTeam === 'under' && parseInt(gameData.scores[0].score) + parseInt(gameData.scores[1].score) < betPoints) {
    return 'won';
  } else if (parseInt(gameData.scores[0].score) + parseInt(gameData.scores[1].score) === betPoints) {
    return 'tied';
  } else {
    return 'lost';
  }
}

function increaseAccountBalance(userId, betAmount, potentialWinnings, next) {
  const params = [userId];
  const sql = `
    SELECT "accountBalance", "userId"
    FROM "users"
    WHERE "userId" = $1
  `;
  db.query(sql, params)
    .then(dbResponse => dbResponse.rows[0])
    .then(userRecord => {
      const params = [parseFloat(userRecord.accountBalance) + betAmount + potentialWinnings, userRecord.userId];
      const sql = `
        UPDATE "users"
        SET "accountBalance" = $1
        WHERE "userId" = $2
      `;
      db.query(sql, params)
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

function subtractAccountBalance(userId, betAmount, next) {
  return new Promise((resolve, reject) => {
    const params = [userId];
    const sql = `
    SELECT "accountBalance", "userId"
    FROM "users"
    WHERE "userId" = $1
  `;
    db.query(sql, params)
      .then(dbResponse => dbResponse.rows[0])
      .then(userRecord => {
        const params = [parseFloat(userRecord.accountBalance) - betAmount, userRecord.userId];
        const sql = `
        UPDATE "users"
        SET "accountBalance" = ($1)
        WHERE "userId" = ($2)
        RETURNING "accountBalance"
      `;
        db.query(sql, params)
          .then(dbResponse => {
            resolve(dbResponse.rows[0].accountBalance);
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
}

function updateBetStatus(betId, betStatus, scores, homeTeam, awayTeam, next) {
  const homeTeamScore = scores.find(elem => elem.name === homeTeam).score;
  const awayTeamScore = scores.find(elem => elem.name === awayTeam).score;
  const params = [betId, betStatus, homeTeamScore, awayTeamScore];
  const sql = `
    UPDATE "bets"
    SET "status" = ($2),
        "homeTeamScore" = ($3),
        "awayTeamScore" = ($4)
    WHERE "betId" = ($1)
  `;
  db.query(sql, params)
    .catch(err => next(err));
}

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
  const date = new Date();
  if (gameStart < date.toISOString()) {
    throw new ClientError(400, 'Cannot place a bet for a live game, or game that has completed!');
  }
  if (betAmount < 1) {
    throw new ClientError(400, 'Bet amount cannot be less than 1');
  }
  function retrieveGameData(placedBet, checkTime) {
    setTimeout(() => {
      fetch(`https://api.the-odds-api.com/v4/sports/${placedBet.sportType}/scores?apiKey=${process.env.API_KEY}&daysFrom=3`)
        .then(response => response.json())
        .then(apiResponse => {
          const game = apiResponse.find(elem => {
            return elem.id === placedBet.gameId;
          });
          if (game === undefined) {
            retrieveGameData(placedBet, 1800000);
          } else if (!game.completed) {
            retrieveGameData(placedBet, 1800000);
          } else if (game.completed && placedBet.betType === 'spread') {
            const betResult = calculateSpreadWinner(game, placedBet.winningTeam, parseFloat(placedBet.points));
            if (betResult === 'won') {
              increaseAccountBalance(placedBet.userId, placedBet.betAmount, placedBet.potentialWinnings, next);
            } else if (betResult === 'tied') {
              increaseAccountBalance(placedBet.userId, placedBet.betAmount, 0, next);
            }
            updateBetStatus(placedBet.betId, betResult, game.scores, placedBet.homeTeam, placedBet.awayTeam, next);
          } else if (game.completed && placedBet.betType === 'moneyline') {
            const betResult = calculateMoneylineWinner(game, placedBet.winningTeam);
            if (betResult === 'won') {
              increaseAccountBalance(placedBet.userId, placedBet.betAmount, placedBet.potentialWinnings, next);
            } else if (betResult === 'tied') {
              increaseAccountBalance(placedBet.userId, placedBet.betAmount, 0, next);
            }
            updateBetStatus(placedBet.betId, betResult, game.scores, placedBet.homeTeam, placedBet.awayTeam, next);
          } else if (game.completed && placedBet.betType === 'total') {
            const betResult = calculateTotalWinner(game, placedBet.winningTeam, parseFloat(placedBet.points));
            if (betResult === 'won') {
              increaseAccountBalance(placedBet.userId, placedBet.betAmount, placedBet.potentialWinnings, next);
            } else if (betResult === 'tied') {
              increaseAccountBalance(placedBet.userId, placedBet.betAmount, 0, next);
            }
            updateBetStatus(placedBet.betId, betResult, game.scores, placedBet.homeTeam, placedBet.awayTeam, next);
          }
        })
        .catch(err => next(err));
    }, checkTime, sport, checkTime, gameId);
  }
  const status = 'pending';
  const params = [gameId, parseInt(betAmount), betType, status, userId, gameStart, sport, winningTeam, homeTeam, awayTeam, betOdds, parseFloat(betPoints), potentialWinnings];
  const sql = `
    INSERT INTO "bets" ("gameId", "betAmount", "betType", "status", "userId", "gameStart", "sportType", "winningTeam", "homeTeam", "awayTeam", "price", "points", "potentialWinnings")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;
  db.query(sql, params)
    .then(dbResponse => {
      const placedBet = dbResponse.rows[0];
      const gameStart = new Date(placedBet.gameStart);
      const createdAt = new Date(placedBet.createdAt);
      retrieveGameData(placedBet, gameStart.getTime() - createdAt.getTime() + 10800000);
      return placedBet;
    })
    .then(placedBet => {
      subtractAccountBalance(userId, placedBet.betAmount, next)
        .then(newAccountBalance => {
          placedBet.accountBalance = parseFloat(newAccountBalance);
          res.status(201).json(placedBet);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.patch('/api/deposit', (req, res, next) => {
  let { depositAmount } = req.body;
  if (!depositAmount) {
    throw new ClientError(400, 'Deposit amount amount is required');
  }
  if (isNaN(depositAmount) || depositAmount === '') {
    throw new ClientError(400, 'Deposit amount must be a valid number between 1 and 10,000');
  }
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
      const accountBalance = dbResponse.rows[0].accountBalance;
      const placedDate = new Date(dbResponse.rows[0].lastDeposit);
      const currentTime = new Date();
      if ((currentTime.getTime() - placedDate.getTime() < 60 * 60 * 24 * 1000)) {
        throw new ClientError(400, 'Only one deposit can be made in a 24 hour period');
      }
      if (parseFloat(depositAmount) + parseFloat(accountBalance) > 10000) {
        throw new ClientError(400, 'Deposit and current account balance not to exceed $10,000');
      }
      depositAmount = parseFloat(depositAmount) + parseFloat(accountBalance);
      if (checkDeposit(depositAmount) !== true) {
        const depositError = checkDeposit(depositAmount);
        throw new ClientError(400, `${depositError}`);
      }
      const params = [depositAmount, userId, currentTime];
      const sql = `
        UPDATE "users"
        SET "accountBalance" = $1,
            "lastDeposit" = $3
        WHERE "userId" = $2
        RETURNING "accountBalance", "userName", "lastDeposit"
      `;
      db.query(sql, params)
        .then(dbResponse => {
          const { accountBalance, userName, lastDeposit } = dbResponse.rows[0];
          res.status(200).json({
            success: `${userName}'s new account balance is ${accountBalance} with last deposit on ${lastDeposit}!`,
            accountBalance: parseFloat(accountBalance)
          });
        })
        .catch(err => next(err));
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
