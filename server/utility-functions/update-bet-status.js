function updateBetStatus(db, betId, betStatus, scores, homeTeam, awayTeam, next) {
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

module.exports = updateBetStatus;
