import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      odds: [],
      show: false,
      potentialWinnings: 0,
      betOdds: 0,
      betAmount: 1,
      betType: ''
    };
    this.fetchOddsData = this.fetchOddsData.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.handleBetAmountChange = this.handleBetAmountChange.bind(this);
    this.calculatePotentialWinnings = this.calculatePotentialWinnings.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show,
      betAmount: 1
    });
  }

  componentDidMount() {
    this.fetchOddsData(this.props.sport);
  }

  componentDidUpdate(prevProp) {
    if (this.props.sport !== prevProp.sport) {
      this.fetchOddsData(this.props.sport);
    }
  }

  fetchOddsData(sport) {
    fetch(`https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`)
      .then(response => response.json())
      .then(response => {
        const markets = [];
        for (let i = 0; i < response.length; i++) {
          const marketsObject = {};
          marketsObject.homeTeam = response[i].home_team;
          marketsObject.awayTeam = response[i].away_team;
          marketsObject.startTime = new Date(response[i].commence_time);
          if (!response[i].bookmakers[0]) {
            continue;
          }
          const odds = response[i].bookmakers[0].markets;
          for (let j = 0; j < odds.length; j++) {
            if (odds[j].key === 'spreads') {
              marketsObject.spreads = [];
              if (odds[j].outcomes[0].name === marketsObject.awayTeam) {
                marketsObject.spreads.push(odds[j].outcomes[0]);
                marketsObject.spreads.push(odds[j].outcomes[1]);
              } else {
                marketsObject.spreads.push(odds[j].outcomes[1]);
                marketsObject.spreads.push(odds[j].outcomes[0]);
              }
            } else if (odds[j].key === 'h2h') {
              marketsObject.h2h = [];
              if (odds[j].outcomes[0].name === marketsObject.awayTeam) {
                marketsObject.h2h.push(odds[j].outcomes[0]);
                marketsObject.h2h.push(odds[j].outcomes[1]);
              } else {
                marketsObject.h2h.push(odds[j].outcomes[1]);
                marketsObject.h2h.push(odds[j].outcomes[0]);
              }
            } else if (odds[j].key === 'totals') {
              marketsObject.totals = [];
              if (odds[j].outcomes[0].name === 'Over') {
                marketsObject.totals.push(odds[j].outcomes[0]);
                marketsObject.totals.push(odds[j].outcomes[1]);
              } else {
                marketsObject.totals.push(odds[j].outcomes[1]);
                marketsObject.totals.push(odds[j].outcomes[0]);
              }
            }
          }
          if (!marketsObject.spreads) {
            marketsObject.spreads = [];
            marketsObject.spreads.push({ name: 'N/A', price: 'N/A', point: 'N/A' });
            marketsObject.spreads.push({ name: 'N/A', price: 'N/A', point: 'N/A' });
          }
          if (!marketsObject.h2h) {
            marketsObject.h2h = [];
            marketsObject.h2h.push({ name: 'N/A', price: 'N/A' });
            marketsObject.h2h.push({ name: 'N/A', price: 'N/A' });
          }
          if (!marketsObject.totals) {
            marketsObject.totals = [];
            marketsObject.totals.push({ name: 'Under', price: 'N/A', point: 'N/A' });
            marketsObject.totals.push({ name: 'Over', price: 'N/A', point: 'N/A' });
          }
          markets.push(marketsObject);
        }
        return markets;
      })
      .then(response => {
        this.setState({
          odds: response
        });
      });
  }

  handleClick(event, odds) {
    // event.preventDefault();
    // console.log(odds);
    let betType;
    if (event.target.classList.contains('spread')) {
      betType = 'spread';
    } else if (event.target.classList.contains('moneyline')) {
      betType = 'moneyline';
    } else {
      betType = 'total';
    }
    this.setState({
      betOdds: odds,
      show: true,
      betType
    }, () => {
      this.setState({
        potentialWinnings: this.calculatePotentialWinnings(this.state.betAmount)
      });
    });
    this.toggleShow();
  }

  handleBetAmountChange(event) {
    this.setState({
      betAmount: event.target.value,
      show: true,
      potentialWinnings: this.calculatePotentialWinnings(event.target.value)
    });
  }

  calculatePotentialWinnings(betAmount) {
    let potentialWinnings = 0;
    if (Math.sign(this.state.betOdds) === -1) {
      potentialWinnings = 100 / (this.state.betOdds * -1) * betAmount;
    } else {
      potentialWinnings = this.state.betOdds / 100 * betAmount;
    }
    return potentialWinnings;
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    if (this.state.odds.length < 1) {
      return (
        <>
          <Navigation />
          <Oddsbar />
          <Container>
            <h1 className='text-center mt-5'>This sport is out of season!</h1>
          </Container>
        </>
      );
    }
    return (
      <>
        <Navigation />
        <Oddsbar />
        <Container fluid="md" className="mt-5">
          {
            this.state.odds.map(elem => {
              return (
                <Row key={elem.id} className="justify-content-center">
                  <Table bordered className='table' key={elem.id}>
                    <thead>
                      <tr className="td-no-wrap td-quarter">
                        <th />
                        <th>Team</th>
                        <th>Spread</th>
                        <th>Line</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='td-no-wrap td-quarter'>
                        <td rowSpan="2" className="align-middle text-center">{elem.startTime.toLocaleDateString()}<br />{elem.startTime.toLocaleTimeString()}</td>
                        <td>{elem.awayTeam}</td>
                        <td className="cursor-pointer spread" onClick={e => this.handleClick(e, elem.spreads[0].price)}>{elem.spreads[0].point} ({elem.spreads[0].price})</td>
                        <td className="cursor-pointer moneyline" onClick={e => this.handleClick(e, elem.h2h[0].price)}>{elem.h2h[0].price}</td>
                        <td className="cursor-pointer total" onClick={e => this.handleClick(e, elem.totals[0].price)}>O{elem.totals[0].point} ({elem.totals[0].price})</td>
                      </tr>
                      <tr className='td-no-wrap td-quarter'>
                        <td>{elem.homeTeam}</td>
                        <td className="cursor-pointer spread" onClick={e => this.handleClick(e, elem.spreads[1].price)}>{elem.spreads[1].point} ({elem.spreads[1].price})</td>
                        <td className="cursor-pointer moneyline" onClick={e => this.handleClick(e, elem.h2h[1].price)}>{elem.h2h[1].price}</td>
                        <td className="cursor-pointer total" onClick={e => this.handleClick(e, elem.totals[1].price)}>U{elem.totals[1].point} ({elem.totals[1].price})</td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
              );
            })
          }
        </Container>
        <Modal show={this.state.show} onHide={this.toggleShow}>
          <Modal.Header closeButton>
            <Modal.Title>Place Bet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="betAmount">
                <Form.Label>Bet Amount</Form.Label>
                <Form.Control
                  type="text"
                  autoFocus
                  onChange={this.handleBetAmountChange}
                  value={this.state.betAmount}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="potentialEarnings">
                <Form.Label>Winnings</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.potentialWinnings}
                  readOnly
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleShow}>
              Close
            </Button>
            <Button variant="primary" onClick={this.toggleShow}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
