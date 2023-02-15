import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import createOddsArray from '../lib/create-odds-array';
import PlaceholderTable from '../components/placeholder';
import Popup from '../components/modal';
import BetAccordion from '../components/bet-accordion';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nflOdds: [],
      nbaOdds: [],
      mlbOddds: [],
      gameId: '',
      winningTeam: '',
      show: false,
      potentialWinnings: 0,
      betOdds: 0,
      betAmount: 1,
      betType: '',
      betPoints: 0,
      gameStart: '',
      accountBalance: 0,
      validated: false,
      error: '',
      checkedOdds: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.handleBetAmountChange = this.handleBetAmountChange.bind(this);
    this.calculatePotentialWinnings = this.calculatePotentialWinnings.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findFormErrors = this.findFormErrors.bind(this);
  }

  componentDidMount() {
    const nflPromise = fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
    const nbaPromise = fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
    const mlbPromise = fetch(`https://api.the-odds-api.com/v4/sports/baseball_mlb/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
    const accountBalancePromise = fetch('/api/account-balance', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    });
    const promiseArray = [nflPromise, nbaPromise, mlbPromise, accountBalancePromise];
    Promise.all(promiseArray)
      .then(responses => {
        Promise.all(responses.map(promise => promise.json()))
          .then(results => {
            const nflOdds = createOddsArray(results[0]);
            const nbaOdds = createOddsArray(results[1]);
            const mlbOdds = createOddsArray(results[2]);
            const accountBalance = parseFloat(results[3].accountBalance);
            setTimeout(() => {
              this.setState({
                nflOdds,
                nbaOdds,
                mlbOdds,
                accountBalance,
                checkedOdds: true
              });
            }, 1000);
          });
      })
      .catch(err => console.error(err));
  }

  componentDidUpdate(prevProp) {
    if (this.props.sport !== prevProp.sport) {
      this.setState({
        checkedOdds: false
      });
      const nflPromise = fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
      const nbaPromise = fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
      const mlbPromise = fetch(`https://api.the-odds-api.com/v4/sports/baseball_mlb/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
      const accountBalancePromise = fetch('/api/account-balance', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-access-token': this.context.token
        }
      });
      const promiseArray = [nflPromise, nbaPromise, mlbPromise, accountBalancePromise];
      Promise.all(promiseArray)
        .then(responses => {
          Promise.all(responses.map(promise => promise.json()))
            .then(results => {
              const nflOdds = createOddsArray(results[0]);
              const nbaOdds = createOddsArray(results[1]);
              const mlbOdds = createOddsArray(results[2]);
              const accountBalance = parseFloat(results[3].accountBalance);
              setTimeout(() => {
                this.setState({
                  nflOdds,
                  nbaOdds,
                  mlbOdds,
                  accountBalance,
                  checkedOdds: true
                });
              }, 1000);
            });
        })
        .catch(err => console.error(err));
    }
  }

  findFormErrors() {
    const { betAmount, accountBalance } = this.state;
    const newErrors = {};
    if (parseFloat(betAmount) < 1) {
      newErrors.error = 'Bet amount cannot be less than 1';
    } else if (parseFloat(betAmount) > parseFloat(accountBalance)) {
      newErrors.error = 'Bet amount cannot exceed account balance!';
    }
    return newErrors;
  }

  toggleShow() {
    this.setState({
      show: !this.state.show,
      betAmount: 1,
      error: ''
    });
  }

  handleClick(event, date, sportType) {
    let betType, betOdds, winningTeam, betPoints;
    const gameObject = this.state[sportType].find(elem => elem.id === event.currentTarget.id);
    if (event.target.classList.contains('spread') && !event.target.textContent.includes('TBD')) {
      betType = 'spread';
      betOdds = parseInt(event.target.textContent.split('(')[1].split(')')[0]);
      event.target.classList.contains('home') ? winningTeam = gameObject.homeTeam : winningTeam = gameObject.awayTeam;
      betPoints = parseFloat(gameObject.spreads.find(elem => elem.name === winningTeam).point);
    } else if (event.target.classList.contains('moneyline') && !event.target.textContent.includes('TBD')) {
      betType = 'moneyline';
      betOdds = parseInt(event.target.textContent);
      event.target.classList.contains('home') ? winningTeam = gameObject.homeTeam : winningTeam = gameObject.awayTeam;
    } else if (event.target.classList.contains('total') && !event.target.textContent.includes('TBD')) {
      betType = 'total';
      betOdds = parseInt(event.target.textContent.split('(')[1].split(')')[0]);
      event.target.classList.contains('over') ? winningTeam = 'Over' : winningTeam = 'Under';
      betPoints = parseFloat(gameObject.totals.find(elem => elem.name === winningTeam).point);
    } else {
      return;
    }
    const gameStart = date.toISOString();
    this.setState({
      betOdds,
      show: true,
      gameId: event.currentTarget.id,
      winningTeam,
      homeTeam: gameObject.homeTeam,
      awayTeam: gameObject.awayTeam,
      betPoints,
      betType,
      gameStart,
      potentialWinnings: this.calculatePotentialWinnings(this.state.betAmount, betOdds)
    });
  }

  handleBetAmountChange(event) {
    let betAmount = parseFloat(event.target.value);
    if (Number.isNaN(betAmount)) {
      betAmount = '';
    }
    this.setState({
      betAmount,
      show: true,
      potentialWinnings: this.calculatePotentialWinnings(event.target.value, this.state.betOdds)
    });
  }

  calculatePotentialWinnings(betAmount, odds) {
    let potentialWinnings = 0;
    if (Math.sign(odds) === -1) {
      potentialWinnings = 100 / (odds * -1) * betAmount;
    } else {
      potentialWinnings = odds / 100 * betAmount;
    }
    if (Number.isNaN(potentialWinnings)) {
      potentialWinnings = 0;
    }
    return potentialWinnings;
  }

  handleSubmit(event) {
    event.preventDefault();
    const newErrors = this.findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      this.setState({
        error: newErrors.error,
        show: true,
        betAmount: parseInt(event.target.elements.betAmount.value)
      });
    } else {
      const data = this.state;
      data.userId = this.context.user.userId;
      data.sportType = this.props.sport;
      fetch('/api/place-bet', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-access-token': this.context.token
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (response.status === 201) {
            return response.json();
          }
        })
        .then(response => {
          this.setState({
            accountBalance: response.accountBalance,
            error: '',
            show: false
          });
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    // console.count('rerenders');
    if (!this.context.user) return <Redirect to='sign-up' />;

    if (!this.state.checkedOdds) {
      return (
        <>
          <Navigation accountBalance={this.state.accountBalance} />
          <Oddsbar />
          <PlaceholderTable numRows={4} headerRow={['Date', 'Team', 'Spread', 'Line', 'Total']}/>
        </>
      );
    }

    /* if (this.state.checkedOdds && this.state.odds.length < 1) {
      return (
        <>
          <Navigation accountBalance={this.state.accountBalance} />
          <Oddsbar />
          <Container>
            <h1 className="text-center mt-5">This sport must be out of season!</h1>
          </Container>
        </>
      );
    } */

    return (
      <>
        <Navigation accountBalance={this.state.accountBalance}/>
        <Oddsbar/>
        <Container className='mt-5'>
          <BetAccordion onClick={this.handleClick} nflOdds={this.state.nflOdds} nbaOdds={this.state.nbaOdds} mlbOdds={this.state.mlbOddds} />
          {/* {
            this.state.odds.map(elem => {
              return (
                <BetTable elem={elem} key={elem.id} onClick={e => this.handleClick(e, elem.startTime) }/>
              );
            })
          } */}
        </Container>
        <Popup data={this.state} onHide={this.toggleShow} handleSubmit={this.handleSubmit} handleBetAmountChange={this.handleBetAmountChange}/>
      </>
    );
  }
}

HomePage.contextType = AppContext;
