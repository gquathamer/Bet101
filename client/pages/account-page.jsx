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

export default class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      betHistory: [],
      accountBalance: '',
      checkedBalance: false,
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
    const promise1 = fetch('/api/bet-history', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    });

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
            setTimeout(() => {
              this.setState({
                betHistory: results[0],
                accountBalance: parseFloat(results[1].accountBalance),
                checkedBalance: true
              });
            }, 1000);
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
      depositAmount: 1,
      errorMessage: ''
    });
  }

  handleChange(event) {
    let depositAmount = parseFloat(event.target.value);
    if (Number.isNaN(depositAmount)) {
      depositAmount = '';
    }
    this.setState({
      depositAmount,
      show: true
    });
  }

  findFormErrors() {
    const { depositAmount } = this.state;
    if (depositAmount < 1) {
      return { errorMessage: 'Deposit amount must be greater than 0' };
    }
    if (depositAmount > 10000) {
      return { errorMessage: 'Deposit amount must be less than $10,000' };
    }
    if (isNaN(depositAmount)) {
      return { errorMessage: 'Deposit amount must be a valid number' };
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
      const { depositAmount, accountBalance } = this.state;
      const userId = this.context.user.userId;
      const data = {
        depositAmount,
        userId,
        accountBalance
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
            throw new Error('Only one deposit can be made in a 24 hour period');
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
    if (!this.state.checkedBalance) {
      return (
        <>
          <Navigation accountBalance={this.state.accountBalance} />
          <Oddsbar />
          <PlaceholderTable numRows={4} id="bet-history-table" headerRow={['Placed Date', 'Bet', 'Amount', 'State']} />
        </>
      );
    }

    if (this.state.checkedBalance && this.state.betHistory.length < 1) {
      return (
        <>
          <Navigation accountBalance={this.state.accountBalance} />
          <Oddsbar />
          <Container>
            <h1 className="text-center mt-5">No bet history to display!</h1>
          </Container>
        </>
      );
    }

    return (
      <>
        <Navigation accountBalance={this.state.accountBalance}/>
        <Oddsbar />
        <Container className="mt-5">
          <Row>
            <Col sm={9}>
              <h2 className="align-vertical">Running Low on Funds?</h2>
            </Col>
            <Col sm={3} className="text-left">
              <Button type="submit" id="deposit-button" onClick={this.handleShow}>
                Deposit
              </Button>
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
                          <span className='abbreviated-text'>{abbreviationsObject[elem.awayTeam]} </span>
                          <span className='full-text'>{elem.awayTeam} </span>
                          : <span className={awayTeamScoreColor}>{elem.awayTeamScore} </span>
                          @
                          <span className='abbreviated-text'> {abbreviationsObject[elem.homeTeam]} </span>
                          <span className='full-text'> {elem.homeTeam} </span>
                          : <span className={homeTeamScoreColor}>{elem.homeTeamScore}</span>
                          <br />
                        </span>
                        <span className='abbreviated-text'> {abbreviationsObject[elem.winningTeam]} </span>
                        <span className='full-text'> {elem.winningTeam} </span>
                        {elem.betType.charAt(0).toUpperCase() + elem.betType.slice(1)} {elem.points > 0 ? '+' : ''}{elem.points} ({elem.price})
                      </td>
                      <td>
                        <span className={betStatusColor}>{operator}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(elem.betAmount)}</span>
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
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Deposit More $$$</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={this.state.valid} onSubmit={this.handleSubmit}>
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
