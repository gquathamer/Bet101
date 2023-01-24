import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import AppContext from '../lib/app-context';
import fetchAccountBalance from '../lib/fetch-account-balance';

export default class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      betHistory: [],
      accountBalance: ''
    };
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
      .then(response => this.setState({
        betHistory: response,
        accountBalance: fetchAccountBalance(this.context.token)
      }))
      .catch(err => console.error(err));
  }

  render() {
    if (this.state.betHistory.length < 1) {
      return null;
    }
    return (
      <>
        <Navigation accountBalance={this.state.accountBalance}/>
        <Oddsbar />
        <Container>
          <Table bordered className='mt-5' id='bet-history-table' fluid="md">
            <thead>
              <tr className="td-no-wrap">
                <th className='td-quarter align-middle'>Placed Date</th>
                <th>Bet</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.betHistory.map(elem => {
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
                    operator = '';
                  }
                  return (
                    <tr className='td-no-wrap td-quarter' key={elem.id}>
                      <td className="align-middle">{new Date(elem.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span id='bet-history-game-details'>
                          {elem.awayTeam}
                          <br/>
                          @
                          <br/>
                          {elem.homeTeam}
                        </span>
                        <br />
                        {elem.winningTeam} {elem.points} ({elem.price})
                      </td>
                      <td>
                        <span className={betStatusColor}>{operator}{elem.betAmount}</span>
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
      </>
    );
  }
}

AccountPage.contextType = AppContext;
