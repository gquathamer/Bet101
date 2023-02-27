function subtractAccountBalance(db, userId, betAmount, next) {
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

module.exports = subtractAccountBalance;
