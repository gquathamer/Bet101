import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import PlaceholderTable from '../components/placeholder';
import AppContext from '../lib/app-context';
import { abbreviationsObject } from '../lib/abbreviations';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Footer from '../components/footer';
import Redirect from '../components/redirect';

export default class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      betHistory: [],
      accountBalance: 0,
      checkedHistory: false,
      show: false,
      valid: false,
      errorMessage: '',
      depositAmount: 1
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findFormErrors = this.findFormErrors.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch('/api/bet-history', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    })
      .then(response => response.json())
      .then(response => {
        setTimeout(() => {
          this.setState({
            betHistory: response,
            checkedHistory: true
          });
        }, 1000);
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
      depositAmount: 1,
      errorMessage: ''
    });
  }

  handleChange(event) {
    const depositAmount = event.target.value;
    this.setState({
      depositAmount,
      show: true
    });
  }

  findFormErrors() {
    let { depositAmount, accountBalance } = this.state;
    if (isNaN(depositAmount) || depositAmount === '') {
      return { errorMessage: 'Deposit amount must be a valid number' };
    }
    depositAmount = parseFloat(depositAmount);
    if (depositAmount < 1) {
      return { errorMessage: 'Deposit amount must be at least $1' };
    }
    if (depositAmount > 10000) {
      return { errorMessage: 'Deposit amount must be less than $10,000' };
    }
    if (depositAmount + accountBalance > 10000) {
      return { errorMessage: 'Deposit and current account balance not to exceed $10,000' };
    }
    return {};
  }

  handleSubmit(event) {
    event.preventDefault();
    const errorsObject = this.findFormErrors();
    if (Object.keys(errorsObject).length > 0) {
      this.setState({
        errorMessage: errorsObject.errorMessage,
        show: true
      });
    } else {
      const { depositAmount } = this.state;
      const data = {
        depositAmount
      };
      fetch('/api/deposit', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'x-access-token': this.context.token
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          if (!response.ok && response.status === 400) {
            this.setState({
              errorMessage: 'Only one deposit can be made in a 24 hour period'
            });
            return Promise.reject(new Error('Only one deposit can be made in a 24 hour period'));
          }
        })
        .then(response => {
          this.setState({
            accountBalance: response.accountBalance,
            depositAmount: 1,
            errorMessage: '',
            show: false
          });
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    if (!this.context.user) return <Redirect to='sign-up' />;

    if (!this.state.checkedHistory) {
      return (
        <>
          <div className="content">
            <Navigation />
            <Oddsbar />
            <Container className="mt-5" fluid="md">
              <PlaceholderTable numRows={4} id="bet-history-table" headerRow={['Placed Date', 'Bet', 'Amount', 'State']} />
            </Container>
          </div>
          <Footer className="footer" />
        </>
      );
    }

    if (this.state.checkedHistory && this.state.betHistory.length < 1) {
      return (
        <>
          <div className="content">
            <Navigation />
            <Oddsbar />
            <Container className="mt-5" fluid="md">
              <h1 className="text-center mt-5">No bet history to display!</h1>
            </Container>
          </div>
          <Footer className="footer" />
        </>
      );
    }

    return (
      <>
        <Navigation />
        <Oddsbar />
        <div className="content">
          <Container className="my-5" fluid="md">
            <Row>
              <Col sm={9}>
                <a onClick={this.handleShow} id="deposit-anchor">Running Low on Funds?</a>
              </Col>
            </Row>
            <Table bordered className='mt-5' id='bet-history-table' fluid="md">
              <thead>
                <tr className="td-no-wrap">
                  <th className='align-middle table-data-20'>Placed Date</th>
                  <th className="table-data-40">Bet</th>
                  <th className="table-data-20">Amount</th>
                  <th className="table-data-20">Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.betHistory.map(elem => {
                    let homeTeamScoreColor;
                    let awayTeamScoreColor;
                    if (elem.homeTeamScore > elem.awayTeamScore) {
                      homeTeamScoreColor = 'winning-score';
                      awayTeamScoreColor = 'losing-score';
                    } else {
                      awayTeamScoreColor = 'winning-score';
                      homeTeamScoreColor = 'losing-score';
                    }
                    let betStatusColor;
                    let operator;
                    if (elem.status === 'won') {
                      betStatusColor = 'green-color';
                      operator = '+';
                    } else if (elem.status === 'lost') {
                      betStatusColor = 'red-color';
                      operator = '-';
                    } else {
                      betStatusColor = 'white-color';
                      operator = '-';
                    }
                    return (
                      <tr className='td-no-wrap td-quarter' key={elem.betId}>
                        <td className="align-middle">{new Date(elem.createdAt).toLocaleDateString()}</td>
                        <td className="double-line-height">
                          <span id="bet-history-game-details">
                            {new Date(elem.gameStart).toLocaleDateString()}: {new Date(elem.gameStart).toLocaleTimeString()}
                            <br />
                            <span className='abbreviated-text'>{abbreviationsObject[elem.awayTeam]}</span>
                            <span className='full-text'>{elem.awayTeam}</span>
                            : <span className={awayTeamScoreColor}>{elem.awayTeamScore} </span>
                            @
                            <span className='abbreviated-text'> {abbreviationsObject[elem.homeTeam]}</span>
                            <span className='full-text'> {elem.homeTeam}</span>
                            : <span className={homeTeamScoreColor}>{elem.homeTeamScore}</span>
                            <br />
                          </span>
                          <span className='abbreviated-text'> {abbreviationsObject[elem.winningTeam]} </span>
                          <span className='full-text'> {elem.winningTeam} </span>
                          {elem.betType.charAt(0).toUpperCase() + elem.betType.slice(1)} {elem.points > 0 ? '+' : ''}{elem.points} ({elem.price})
                        </td>
                        <td>
                          <span className={betStatusColor}>{operator}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(betStatusColor === 'green-color' ? elem.betAmount + elem.potentialWinnings : elem.betAmount)}</span>
                        </td>
                        <td>
                          <span className={betStatusColor}>{elem.status}</span>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </Table>
          </Container>
        </div>
        <Footer className="footer" />
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Deposit More $$$</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={this.state.valid} onSubmit={this.handleSubmit}>
              <p><strong>Deposit anywhere between $1 and $10,000</strong></p>
              <p>Account balance not to exceed $10,000</p>
              <Form.Group className="mb-3">
                <Form.Label>Deposit Amount:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control required type="text" onChange={this.handleChange} value={this.state.depositAmount} isInvalid={!!this.state.errorMessage} />
                  <Form.Control.Feedback type="invalid">{this.state.errorMessage}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button type="submit" id="deposit-submit-button">
                $$$
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

AccountPage.contextType = AppContext;
