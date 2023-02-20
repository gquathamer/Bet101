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
      sport: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.handleBetAmountChange = this.handleBetAmountChange.bind(this);
    this.calculatePotentialWinnings = this.calculatePotentialWinnings.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findFormErrors = this.findFormErrors.bind(this);
  }

  findFormErrors() {
    const { betAmount, accountBalance, potentialWinnings } = this.state;
    const newErrors = {};
    if (isNaN(betAmount) || betAmount === '') {
      newErrors.error = 'Bet amount must be a valid number';
    }
    if (potentialWinnings === 0) {
      newErrors.error = 'Bet amount must not include any letters or numbers';
    }
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
    /* if (Number.isNaN(betAmount)) {
      betAmount = '';
    } */
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
      data.sportType = this.state.sport;
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
          <Navigation />
          <Oddsbar />
          <Container className='mt-5' fluid="md">
            {pageContent}
          </Container>
          <Popup data={this.state} onHide={this.toggleShow} handleSubmit={this.handleSubmit} handleBetAmountChange={this.handleBetAmountChange} />
        </div>
        <Footer className='footer' />
      </>
    );
  }
}

HomePage.contextType = AppContext;
