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

module.exports = calculateMoneylineWinner;
