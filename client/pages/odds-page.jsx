import React from 'react';
import Container from 'react-bootstrap/Container';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import PlaceBetModal from '../components/place-bet-modal';
import BetAccordion from '../components/bet-accordion';
import BetTable from '../components/bet-table';

export default class OddsPage extends React.Component {
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
      formFeedback: '',
      sport: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleBetAmountChange = this.handleBetAmountChange.bind(this);
    this.calculatePotentialWinnings = this.calculatePotentialWinnings.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findFormErrors = this.findFormErrors.bind(this);
  }

  handleShow() {
    this.setState({
      show: true
    });
  }

  handleClose() {
    this.setState({
      show: false,
      validated: false,
      betAmount: 1,
      formFeedback: ''
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
      formFeedback: '',
      validated: false,
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
    let { betAmount, gameStart } = this.state;
    if (new Date(gameStart).getTime() < Date.now()) {
      return { errorMessage: 'Cannot place bets for games that have finished or are live. Refresh the page!' };
    }
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
    if (betAmount > this.context.accountBalance) {
      return { errorMessage: 'Bet amount cannot exceed account balance!' };
    }
    return {};
  }

  handleSubmit(event) {
    event.preventDefault();
    const errorsObject = this.findFormErrors();
    if (Object.keys(errorsObject).length > 0) {
      this.setState({
        formFeedback: errorsObject.errorMessage,
        validated: false,
        show: true,
        betAmount: this.state.betAmount
      });
      return;
    }
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
        if (!response.ok && response.status === 400) {
          this.setState({
            formFeedback: 'Error placing bet'
          });
          return Promise.reject(new Error('Error placing bet'));
        }
        if (response.status === 201) {
          return response.json();
        }
      })
      .then(response => {
        this.setState({
          validated: true
        });
        this.context.updateAccountBalance(response.accountBalance);
      })
      .catch(err => {
        console.error(err);
        this.setState({
          formFeedback: 'Sorry, it looks like there was an error! Make sure you\'re online and try again'
        });
      });
  }

  render() {
    if (!this.context.user) return <Redirect to='log-in' />;

    let pageContent;
    if (this.context.route.path === 'all') {
      pageContent = <BetAccordion onClick={this.handleClick} nflOdds={this.props.odds.nflOdds} nbaOdds={this.props.odds.nbaOdds} mlbOdds={this.props.odds.mlbOdds} ncaabOdds={this.props.odds.ncaabOdds} />;
    } else if (this.props.odds[this.context.route.path + 'Odds'].length > 1) {
      pageContent = this.props.odds[this.context.route.path + 'Odds'].map(elem => {
        return (
          <BetTable elem={elem} key={elem.id} onClick={e => this.handleClick(e, elem.startTime, this.context.route.path + 'Odds')} />
        );
      });
    } else {
      pageContent = <h1 className="text-center mtb-3">Cannot find odds for this sport currently!</h1>;
    }

    return (
      <>
        <Container className='mt-5' fluid="md">
          {pageContent}
        </Container>
        <PlaceBetModal data={this.state} onHide={this.handleClose} handleSubmit={this.handleSubmit} handleBetAmountChange={this.handleBetAmountChange} />
      </>
    );
  }
}

OddsPage.contextType = AppContext;
