import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import PlaceholderTable from '../components/placeholder';
import AppContext from '../lib/app-context';
import { abbreviationsObject } from '../lib/abbreviations';

export default class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      betHistory: [],
      accountBalance: '',
      checkedBalance: false,
      display: 'none'
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
        <Container>
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
                        {elem.betType.charAt(0).toUpperCase() + elem.betType.slice(1)} {elem.points} ({elem.price})
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
