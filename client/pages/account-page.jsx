import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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
          {
            this.state.betHistory.map(elem => {
              return (
                <Row key={elem.betId} className="justify-content-center">
                  <Table bordered className='table' key={elem.betId} id={elem.betId}>
                    <thead>
                      <tr className="td-no-wrap td-quarter">
                        <th />
                        <th>Date</th>
                        <th>Bet</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='td-no-wrap td-quarter'>
                        <td rowSpan="2" className="align-middle text-center">{new Date(elem.gameStart).toLocaleDateString()}</td>
                        <td className="">
                          {elem.awayTeam} @ {elem.homeTeam}
                          <br />
                          {elem.winningTeam} {elem.points} ({elem.price})
                        </td>
                        <td className="">
                          {elem.betAmount}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
              );
            })
          }
        </Container>
      </>
    );
  }
}

AccountPage.contextType = AppContext;
