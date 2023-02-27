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

module.exports = calculateSpreadWinner;
