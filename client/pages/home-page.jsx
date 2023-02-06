import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import InputGroup from 'react-bootstrap/InputGroup';
import createOddsArray from '../lib/create-odds-array';
import { abbreviationsObject } from '../lib/abbreviations';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      odds: [],
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
      error: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.handleBetAmountChange = this.handleBetAmountChange.bind(this);
    this.calculatePotentialWinnings = this.calculatePotentialWinnings.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findFormErrors = this.findFormErrors.bind(this);
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

  componentDidMount() {
    const promise1 = fetch(`https://api.the-odds-api.com/v4/sports/${this.props.sport}/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
    const promise2 = fetch('/api/account-balance', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    });
    const promiseArray = [promise1, promise2];
    Promise.all(promiseArray)
      .then(responses => {
        Promise.all(responses.map(promise => promise.json()))
          .then(results => {
            const odds = createOddsArray(results[0]);
            const accountBalance = parseFloat(results[1].accountBalance);
            this.setState({
              odds,
              accountBalance
            });
          });
      })
      .catch(err => console.error(err));
  }

  componentDidUpdate(prevProp) {
    if (this.props.sport !== prevProp.sport) {
      const promise1 = fetch(`https://api.the-odds-api.com/v4/sports/${this.props.sport}/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
      const promise2 = fetch('/api/account-balance', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-access-token': this.context.token
        }
      });
      const promiseArray = [promise1, promise2];
      Promise.all(promiseArray)
        .then(responses => {
          Promise.all(responses.map(promise => promise.json()))
            .then(results => {
              const odds = createOddsArray(results[0]);
              const accountBalance = parseFloat(results[1].accountBalance);
              this.setState({
                odds,
                accountBalance
              });
            });
        })
        .catch(err => console.error(err));
    }
  }

  handleClick(event, date) {
    let betType, betOdds, winningTeam, betPoints;
    const gameObject = this.state.odds.find(elem => elem.id === event.currentTarget.id);
    if (event.target.classList.contains('spread') && !event.target.textContent.includes('TBD')) {
      betType = 'Spread';
      betOdds = parseInt(event.target.textContent.split('(')[1].split(')')[0]);
      event.target.classList.contains('home') ? winningTeam = gameObject.homeTeam : winningTeam = gameObject.awayTeam;
      betPoints = parseFloat(gameObject.spreads.find(elem => elem.name === winningTeam).point);
    } else if (event.target.classList.contains('moneyline') && !event.target.textContent.includes('TBD')) {
      betType = 'Moneyline';
      betOdds = parseInt(event.target.textContent);
      event.target.classList.contains('home') ? winningTeam = gameObject.homeTeam : winningTeam = gameObject.awayTeam;
    } else if (event.target.classList.contains('total') && !event.target.textContent.includes('TBD')) {
      betType = 'Total';
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
    if (this.state.odds.length < 1) {
      return (
        <>
          <Navigation accountBalance={this.state.accountBalance}/>
          <Oddsbar />
          <Container>
            <h1 className='text-center mt-5'>This sport is out of season!</h1>
          </Container>
        </>
      );
    }
    return (
      <>
        <Navigation accountBalance={this.state.accountBalance}/>
        <Oddsbar />
        <Container>
          {
            this.state.odds.map(elem => {
              return (
                <Table fluid="md" className="mt-5" onClick={e => this.handleClick(e, elem.startTime)} bordered key={elem.id} id={elem.id}>
                  <thead>
                    <tr className="td-no-wrap td-quarter">
                      <th>Date</th>
                      <th>Team</th>
                      <th>Spread</th>
                      <th>Line</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='td-no-wrap td-quarter'>
                      <td rowSpan="2" className="align-middle text-center">{elem.startTime.toLocaleDateString()}<br />{elem.startTime.toLocaleTimeString()}</td>
                      <td>
                        <span className='abbreviated-text'>{abbreviationsObject[elem.awayTeam]} </span>
                        <span className='full-text'>{elem.awayTeam} </span>
                      </td>
                      <td className="cursor-pointer spread away">{elem.spreads[0].point > 0 ? '+' : ''}{elem.spreads[0].point} ({elem.spreads[0].price})</td>
                      <td className="cursor-pointer moneyline away">{elem.h2h[0].price > 0 ? '+' : ''}{elem.h2h[0].price}</td>
                      <td className="cursor-pointer total over">O {elem.totals[0].point} ({elem.totals[0].price > 0 ? '+' : ''}{elem.totals[0].price})</td>
                    </tr>
                    <tr className='td-no-wrap td-quarter'>
                      <td>
                        <span className='abbreviated-text'> {abbreviationsObject[elem.homeTeam]} </span>
                        <span className='full-text'> {elem.homeTeam} </span>
                      </td>
                      <td className="cursor-pointer spread home">{elem.spreads[1].point > 0 ? '+' : ''}{elem.spreads[1].point} ({elem.spreads[1].price})</td>
                      <td className="cursor-pointer moneyline home">{elem.h2h[1].price > 0 ? '+' : ''}{elem.h2h[1].price}</td>
                      <td className="cursor-pointer total under">U {elem.totals[1].point} ({elem.totals[1].price > 0 ? '+' : ''}{elem.totals[1].price})</td>
                    </tr>
                  </tbody>
                </Table>
              );
            })
          }
        </Container>
        <Modal show={this.state.show} onHide={this.toggleShow}>
          <Modal.Header closeButton>
            <Modal.Title>Place Bet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
              <p>{this.state.awayTeam} @ {this.state.homeTeam}</p>
              <p>{new Date(this.state.gameStart).toLocaleDateString()} {new Date(this.state.gameStart).toLocaleTimeString()}</p>
              <p>
                {`
                  ${this.state.winningTeam}
                  ${this.state.betType}
                  ${this.state.betPoints > 0 ? '+' : ''}${this.state.betPoints === undefined ? '' : this.state.betPoints}
                  (${this.state.betOdds > 0 ? '+' : ''}${this.state.betOdds})
                `}
              </p>
              <Form.Group className="mb-3" controlId="betAmount">
                <Form.Label>Bet Amount</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="betAmount"
                    required
                    isInvalid={!!this.state.error}
                    autoFocus
                    onChange={this.handleBetAmountChange}
                    value={this.state.betAmount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.error}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="potentialEarnings">
                <Form.Label>Winnings</Form.Label>
                <Form.Control
                  type="text"
                  value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.potentialWinnings)}
                  disabled
                />
              </Form.Group>
              <Button type="submit" id="red-color">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

HomePage.contextType = AppContext;
