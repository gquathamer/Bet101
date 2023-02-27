import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import Popup from '../components/modal';
import BetAccordion from '../components/bet-accordion';
import BetTable from '../components/bet-table';
import Footer from '../components/footer';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: '',
      winningTeam: '',
      show: false,
      potentialWinnings: 0,
      betOdds: 0,
      betAmount: 1,
      betType: '',
      betPoints: 0,
      gameStart: '',
      validated: false,
      error: '',
      sport: '',
      accountBalance: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleBetAmountChange = this.handleBetAmountChange.bind(this);
    this.calculatePotentialWinnings = this.calculatePotentialWinnings.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findFormErrors = this.findFormErrors.bind(this);
  }

  componentDidMount() {
    if (!this.context.token) {
      return;
    }
    fetch('/api/account-balance', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          accountBalance: parseFloat(response.accountBalance)
        });
      })
      .catch(err => console.error(err));
  }

  handleShow() {
    this.setState({
      show: true
    });
  }

  handleClose() {
    this.setState({
      show: false,
      betAmount: 1,
      errorMessage: ''
    });
  }

  handleClick(event, date, type) {
    let betType, betOdds, winningTeam, betPoints, sportType;
    if (type === 'nflOdds') {
      sportType = 'americanfootball_nfl';
    } else if (type === 'nbaOdds') {
      sportType = 'basketball_nba';
    } else if (type === 'mlbOdds') {
      sportType = 'baseball_mlb';
    } else {
      sportType = 'basketball_ncaab';
    }
    const gameObject = this.props.odds[type].find(elem => elem.id === event.currentTarget.id);
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
      sport: sportType,
      potentialWinnings: this.calculatePotentialWinnings(this.state.betAmount, betOdds)
    });
  }

  handleBetAmountChange(event) {
    const betAmount = event.target.value;
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

  findFormErrors() {
    let { betAmount } = this.state;
    if (Number.isNaN(+betAmount)) {
      return { errorMessage: 'Bet amount must be a valid number' };
    }
    if (typeof betAmount === 'string' && betAmount.trim() === '') {
      return { errorMessage: 'Bet amount must be a valid number' };
    }
    betAmount = parseFloat(betAmount);
    if (betAmount < 1) {
      return { errorMessage: 'Bet amount must be at least $1' };
    }
    if (betAmount > this.state.accountBalance) {
      return { errorMessage: 'Bet amount cannot exceed account balance!' };
    }
    return {};
  }

  handleSubmit(event) {
    event.preventDefault();
    const errorsObject = this.findFormErrors();
    if (Object.keys(errorsObject).length > 0) {
      this.setState({
        error: errorsObject.errorMessage,
        show: true,
        betAmount: this.state.betAmount
      });
    } else {
      const data = this.state;
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
          if (!response.ok && response.status === 400) {
            this.setState({
              errorMessage: 'Error placing bet'
            });
            return Promise.reject(new Error('Error placing bet'));
          }
        })
        .then(response => {
          this.setState({
            error: '',
            show: false,
            betAmount: 1,
            accountBalance: response.accountBalance
          });
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    if (!this.context.user) return <Redirect to='sign-up' />;

    let pageContent;
    if (this.props.hash === '' || this.props.hash === 'homepage') {
      pageContent = <BetAccordion onClick={this.handleClick} nflOdds={this.props.odds.nflOdds} nbaOdds={this.props.odds.nbaOdds} mlbOdds={this.props.odds.mlbOdds} ncaabOdds={this.props.odds.ncaabOdds} />;
    } else if (this.props.odds[this.props.hash + 'Odds'].length > 1) {
      pageContent = this.props.odds[this.props.hash + 'Odds'].map(elem => {
        return (
          <BetTable elem={elem} key={elem.id} onClick={e => this.handleClick(e, elem.startTime, this.props.hash + 'Odds')} />
        );
      });
    } else {
      pageContent = <h1 className="text-center mtb-3">Cannot find odds for this sport currently!</h1>;
    }

    return (
      <>
        <div className='content'>
          <Navigation accountBalance={this.state.accountBalance}/>
          <Oddsbar />
          <Container className='mt-5' fluid="md">
            {pageContent}
          </Container>
          <Popup data={this.state} onHide={this.handleClose} handleSubmit={this.handleSubmit} handleBetAmountChange={this.handleBetAmountChange} />
        </div>
        <Footer className='footer' />
      </>
    );
  }
}

HomePage.contextType = AppContext;
