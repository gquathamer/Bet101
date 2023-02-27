function increaseAccountBalance(db, userId, betAmount, potentialWinnings, next) {
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

module.exports = increaseAccountBalance;
