import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      odds: []
    };
  }

  componentDidMount() {
    fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`)
      .then(response => response.json())
      .then(response => {
        const markets = [];
        for (let i = 0; i < response.length; i++) {
          const marketsObject = {};
          marketsObject.homeTeam = response[i].home_team;
          marketsObject.awayTeam = response[i].away_team;
          const odds = response[i].bookmakers[0].markets;
          for (let j = 0; j < odds.length; j++) {
            if (odds[j].key === 'spreads') {
              marketsObject.spreads = odds[j].outcomes;
            } else {
              marketsObject.h2h = odds[j].outcomes;
            }
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

  render() {
    return (
      <>
        <Navigation />
        <Oddsbar />
        <Container fluid="md" className="mt-5">
          {
            this.state.odds.map(elem => {
              return (
                <Row key={elem.id} className="justify-content-center">
                  <Col key={elem.id} md={6} sm={9}>
                    <Table>
                      <thead>
                        <tr>
                          <th>Team</th>
                          <th>Spread</th>
                          <th>Line</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{elem.awayTeam}</td>
                          <td>test</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>{elem.homeTeam}</td>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td colSpan={2}>Larry the Bird</td>
                          <td>@twitter</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              );
            })
          }
        </Container>
      </>
    );
  }
}
