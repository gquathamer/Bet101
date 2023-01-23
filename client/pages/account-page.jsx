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
      betHistory: []
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
      .then(response => this.setState({ betHistory: response }))
      .catch(err => console.error(err));
  }

  render() {
    if (this.state.betHistory.length < 1) {
      return null;
    }
    return (
      <>
        <Navigation />
        <Oddsbar />
        <Container>
          <Table bordered className='mt-5' id='bet-history-table' fluid="md">
            <thead>
              <tr className="td-no-wrap">
                <th className='td-quarter align-middle'>Date</th>
                <th>Bet</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.betHistory.map(elem => {
                  return (
                    <tr className='td-no-wrap td-quarter' key={elem.id}>
                      <td className="align-middle">{new Date(elem.gameStart).toLocaleDateString()}</td>
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
                      <td className="">
                        {elem.betAmount}
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
