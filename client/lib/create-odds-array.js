export default function createOddsArray(oddsData) {
  const games = [];
  for (let i = 0; i < oddsData.length; i++) {
    if (!oddsData[i].bookmakers[0]) {
      continue;
    }
    const date = new Date();
    if (oddsData[i].commence_time < date.toISOString()) {
      continue;
    }
    const gameObject = {};
    gameObject.homeTeam = oddsData[i].home_team;
    gameObject.awayTeam = oddsData[i].away_team;
    gameObject.startTime = new Date(oddsData[i].commence_time);
    gameObject.id = oddsData[i].id;
    const odds = oddsData[i].bookmakers[0].markets;
    for (let j = 0; j < odds.length; j++) {
      if (odds[j].key === 'spreads') {
        gameObject.spreads = [];
        if (odds[j].outcomes[0].name === gameObject.awayTeam) {
          gameObject.spreads.push(odds[j].outcomes[0]);
          gameObject.spreads.push(odds[j].outcomes[1]);
        } else {
          gameObject.spreads.push(odds[j].outcomes[1]);
          gameObject.spreads.push(odds[j].outcomes[0]);
        }
      } else if (odds[j].key === 'h2h') {
        gameObject.h2h = [];
        if (odds[j].outcomes[0].name === gameObject.awayTeam) {
          gameObject.h2h.push(odds[j].outcomes[0]);
          gameObject.h2h.push(odds[j].outcomes[1]);
        } else {
          gameObject.h2h.push(odds[j].outcomes[1]);
          gameObject.h2h.push(odds[j].outcomes[0]);
        }
      } else if (odds[j].key === 'totals') {
        gameObject.totals = [];
        if (odds[j].outcomes[0].name === 'Over') {
          gameObject.totals.push(odds[j].outcomes[0]);
          gameObject.totals.push(odds[j].outcomes[1]);
        } else {
          gameObject.totals.push(odds[j].outcomes[1]);
          gameObject.totals.push(odds[j].outcomes[0]);
        }
      }
    }
    if (!gameObject.spreads) {
      gameObject.spreads = [];
      gameObject.spreads.push({ name: 'N/A', price: 'N/A', point: 'N/A' });
      gameObject.spreads.push({ name: 'N/A', price: 'N/A', point: 'N/A' });
    }
    if (!gameObject.h2h) {
      gameObject.h2h = [];
      gameObject.h2h.push({ name: 'N/A', price: 'N/A' });
      gameObject.h2h.push({ name: 'N/A', price: 'N/A' });
    }
    if (!gameObject.totals) {
      gameObject.totals = [];
      gameObject.totals.push({ name: 'Under', price: 'N/A', point: 'N/A' });
      gameObject.totals.push({ name: 'Over', price: 'N/A', point: 'N/A' });
    }
    games.push(gameObject);
  }
  return games;
}
