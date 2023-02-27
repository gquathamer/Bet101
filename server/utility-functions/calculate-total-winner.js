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

module.exports = calculateTotalWinner;
