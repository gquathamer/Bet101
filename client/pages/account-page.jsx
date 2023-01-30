import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import AppContext from '../lib/app-context';

export default class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      betHistory: [],
      accountBalance: ''
    };
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
            this.setState({
              betHistory: results[0],
              accountBalance: parseFloat(results[1].accountBalance)
            });
          });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <>
        <Navigation accountBalance={this.state.accountBalance}/>
        <Oddsbar />
        <Container>
          <Table bordered className='mt-5' id='bet-history-table' fluid="md">
            <thead>
              <tr className="td-no-wrap td-quarter">
                <th className='td-quarter align-middle table-data-20'>Placed Date</th>
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
                    <tr className='td-no-wrap td-quarter' key={elem.id}>
                      <td className="align-middle">{new Date(elem.createdAt).toLocaleDateString()}</td>
                      <td className="double-line-height">
                        <span id="bet-history-game-details">
                          {elem.awayTeam} @ {elem.homeTeam} - {new Date(elem.gameStart).toLocaleDateString()}
                          <br />
                          {elem.awayTeam}: <span className={awayTeamScoreColor}>{elem.awayTeamScore}</span>
                          <br />
                          {elem.homeTeam}: <span className={homeTeamScoreColor}>{elem.homeTeamScore}</span>
                          <br />
                        </span>
                        {elem.winningTeam} {elem.betType} {elem.points} ({elem.price})
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
      </>
    );
  }
}

AccountPage.contextType = AppContext;
