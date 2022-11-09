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
