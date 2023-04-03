import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlaceholderTable from '../components/placeholder';
import AppContext from '../lib/app-context';
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
      depositAmount: 1
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
    fetch('/api/bet-history', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    })
      .then(response => response.json())
      .then(results => {
        setTimeout(() => {
          this.setState({
            betHistory: results,
            checkedHistory: true
          });
        }, 1000);
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
    if (depositAmount + this.context.accountBalance > 10000) {
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
        if (!response.ok && response.status === 500) {
          return Promise.reject(new Error('It looks like an error occurred, sorry about that!'));
        }
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(response => {
        this.setState({
          formFeedback: '',
          validated: true
        });
        this.context.updateAccountBalance(response.accountBalance);
        setTimeout(() => {
          this.handleClose();
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        const message = err.message === 'Only one deposit can be made in a 24 hour period'
          ? err.message
          : 'Sorry, it looks like there was an error! Make sure you\'re online and try again';
        this.setState({
          formFeedback: message
        });
      });
  }

  render() {
    if (!this.context.user) return <Redirect to='log-in' />;

    if (!this.state.checkedHistory) {
      return (
        <PlaceholderTable numRows={4} id="bet-history-table" className="column-border mt-5" headerRow={['Placed Date', 'Bet', 'Amount', 'State']} />
      );
    }

    return (
      <>
        <Row>
          <Col sm={9} className="p-2">
            <a onClick={this.handleShow} id="deposit-anchor">Running Low on Funds?</a>
          </Col>
        </Row>
        <BetHistoryTable betHistory={this.state.betHistory} />
        <DepositModal
          show={this.state.show}
          onHide={this.handleClose}
          validated={this.state.validated}
          handleSubmit={this.handleSubmit}
          onChange={this.handleChange}
          value={this.state.depositAmount}
          isInvalid={!!this.state.formFeedback}
          formFeedback={this.state.formFeedback}
        />
      </>
    );
  }
}

AccountPage.contextType = AppContext;
