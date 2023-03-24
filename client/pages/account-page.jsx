import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlaceholderTable from '../components/placeholder';
import AppContext from '../lib/app-context';
import Footer from '../components/footer';
import Redirect from '../components/redirect';
import BetHistoryTable from '../components/bet-history-table';
import DepositModal from '../components/deposit-modal';

export default class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      betHistory: [],
      checkedHistory: false,
      show: false,
      validated: false,
      formFeedback: '',
      depositAmount: 1,
      accountBalance: 0
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findFormErrors = this.findFormErrors.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (!this.context.token) {
      return;
    }
    const accountBalancePromise = fetch('/api/account-balance', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    });
    const betHistoryPromise = fetch('/api/bet-history', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    });
    const promiseArray = [accountBalancePromise, betHistoryPromise];
    Promise.all(promiseArray)
      .then(responses => {
        Promise.all(responses.map(elem => elem.json()))
          .then(results => {
            setTimeout(() => {
              this.setState({
                betHistory: results[1],
                accountBalance: parseFloat(results[0].accountBalance),
                checkedHistory: true
              });
            }, 1000);
          });
      })
      .catch(err => {
        console.error(err);
        setTimeout(() => {
          this.setState({
            checkedHistory: true
          });
        }, 1000);
      });
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
      formFeedback: '',
      validated: false
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
    let { depositAmount } = this.state;
    if (Number.isNaN(+depositAmount)) {
      return { formFeedback: 'Deposit amount must be a valid number' };
    }
    if (typeof depositAmount === 'string' && depositAmount.trim() === '') {
      return { formFeedback: 'Deposit amount must be a valid number' };
    }
    depositAmount = parseFloat(depositAmount);
    if (depositAmount < 1) {
      return { formFeedback: 'Deposit amount must be at least $1' };
    }
    if (depositAmount + this.state.accountBalance > 10000) {
      return { formFeedback: 'Deposit and current account balance not to exceed $10,000' };
    }
    return {};
  }

  handleSubmit(event) {
    event.preventDefault();
    const errorsObject = this.findFormErrors();
    if (Object.keys(errorsObject).length > 0) {
      this.setState({
        formFeedback: errorsObject.formFeedback,
        depositAmount: this.state.depositAmount,
        show: true
      });
      return;
    }
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
        if (!response.ok && response.status === 400) {
          this.setState({
            formFeedback: 'Only one deposit can be made in a 24 hour period'
          });
          return Promise.reject(new Error('Only one deposit can be made in a 24 hour period'));
        }
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(response => {
        this.setState({
          formFeedback: '',
          validated: true,
          accountBalance: parseFloat(response.accountBalance)
        });
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

    if (!this.state.checkedHistory) {
      return (
        <>
          <div className="content">
            <Navigation accountBalance={this.state.accountBalance} activeNavLink={this.props.hash}/>
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
            <Navigation accountBalance={this.state.accountBalance} activeNavLink={this.props.hash}/>
            <Oddsbar />
            <Container className="my-5" fluid="md">
              <Row>
                <Col sm={9}>
                  <a onClick={this.handleShow} id="deposit-anchor">Running Low on Funds?</a>
                </Col>
              </Row>
              <h1 className="text-center mt-5">Hmmmm...</h1>
              <h1 className="text-center mt-5">It looks like there&apos;s no bet history to display, or you may be offline.</h1>
            </Container>
          </div>
          <Footer className="footer" />
          <DepositModal
            show={this.state.show}
            onHide={this.handleClose}
            validated={this.state.validated}
            handleSubmit={this.handleSubmit}
            onChange={this.handleChange}
            value={this.state.depositAmount}
            isInvalid={!!this.state.formFeedback}
            formFeedback={this.state.formFeedback}
            accountBalance={this.state.accountBalance}
          />
        </>
      );
    }

    return (
      <>
        <Navigation accountBalance={this.state.accountBalance} activeNavLink={this.props.hash}/>
        <Oddsbar activeNavLink={this.props.hash}/>
        <div className="content">
          <Container className="my-5" fluid="md">
            <Row>
              <Col sm={9}>
                <a onClick={this.handleShow} id="deposit-anchor">Running Low on Funds?</a>
              </Col>
            </Row>
            <BetHistoryTable betHistory={this.state.betHistory} />
          </Container>
        </div>
        <Footer activeNavLink={this.props.hash} className="footer" />
        <DepositModal
          show={this.state.show}
          onHide={this.handleClose}
          validated={this.state.validated}
          handleSubmit={this.handleSubmit}
          onChange={this.handleChange}
          value={this.state.depositAmount}
          isInvalid={!!this.state.formFeedback}
          formFeedback={this.state.formFeedback}
          accountBalance={this.state.accountBalance}
        />
      </>
    );
  }
}

AccountPage.contextType = AppContext;
