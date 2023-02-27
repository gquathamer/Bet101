const calculateSpreadWinner = require('./calculate-spread-winner');
const calculateMoneylineWinner = require('./calculate-moneyline-winner');
const calculateTotalWinner = require('./calculate-total-winner');
const increaseAccountBalance = require('./increase-account-balance');
const updateBetStatus = require('./update-bet-status');

function retrieveGameData(db, placedBet, checkTime, next) {
  const intervalId = setInterval(() => {
    /* if (checkTime > Date.now()) {
      return;
    } */
    fetch(`https://api.the-odds-api.com/v4/sports/${placedBet.sportType}/scores?apiKey=${process.env.API_KEY}&daysFrom=3`)
      .then(response => response.json())
      .then(apiResponse => {
        // const date = new Date();
        const game = apiResponse.find(elem => {
          return elem.id === placedBet.gameId;
        });
        if (game === undefined) {
          retrieveGameData(placedBet, Date.now() + 10800000);
        } else if (!game.completed) {
          retrieveGameData(placedBet, Date.now() + 10800000);
        } else if (game.completed && placedBet.betType === 'spread') {
          const betResult = calculateSpreadWinner(game, placedBet.winningTeam, parseFloat(placedBet.points));
          if (betResult === 'won') {
            increaseAccountBalance(db, placedBet.userId, placedBet.betAmount, placedBet.potentialWinnings, next);
          } else if (betResult === 'tied') {
            increaseAccountBalance(db, placedBet.userId, placedBet.betAmount, 0, next);
          }
          updateBetStatus(db, placedBet.betId, betResult, game.scores, placedBet.homeTeam, placedBet.awayTeam, next);
        } else if (game.completed && placedBet.betType === 'moneyline') {
          const betResult = calculateMoneylineWinner(game, placedBet.winningTeam);
          if (betResult === 'won') {
            increaseAccountBalance(db, placedBet.userId, placedBet.betAmount, placedBet.potentialWinnings, next);
          } else if (betResult === 'tied') {
            increaseAccountBalance(db, placedBet.userId, placedBet.betAmount, 0, next);
          }
          updateBetStatus(db, placedBet.betId, betResult, game.scores, placedBet.homeTeam, placedBet.awayTeam, next);
        } else if (game.completed && placedBet.betType === 'total') {
          const betResult = calculateTotalWinner(game, placedBet.winningTeam, parseFloat(placedBet.points));
          if (betResult === 'won') {
            increaseAccountBalance(db, placedBet.userId, placedBet.betAmount, placedBet.potentialWinnings, next);
          } else if (betResult === 'tied') {
            increaseAccountBalance(db, placedBet.userId, placedBet.betAmount, 0, next);
          }
          updateBetStatus(db, placedBet.betId, betResult, game.scores, placedBet.homeTeam, placedBet.awayTeam, next);
        }
        clearInterval(intervalId);
      })
      .catch(err => next(err));
    // make sure to change interval time back to 60000 ms to check every second
  }, 1000);
}

module.exports = retrieveGameData;
