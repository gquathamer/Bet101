import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      odds: []
    };
    this.fetchOddsData = this.fetchOddsData.bind(this);
  }

  componentDidMount() {
    this.fetchOddsData(this.props.sport);
  }

  componentDidUpdate(prevProp) {
    if (this.props.sport !== prevProp.sport) {
      this.fetchOddsData(this.props.sport);
    }
  }

  fetchOddsData(sport) {
    fetch(`https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`)
      .then(response => response.json())
      .then(response => {
        const markets = [];
        for (let i = 0; i < response.length; i++) {
          const marketsObject = {};
          marketsObject.homeTeam = response[i].home_team;
          marketsObject.awayTeam = response[i].away_team;
          marketsObject.startTime = new Date(response[i].commence_time);
          if (!response[i].bookmakers[0]) {
            continue;
          }
          const odds = response[i].bookmakers[0].markets;
          for (let j = 0; j < odds.length; j++) {
            if (odds[j].key === 'spreads') {
              marketsObject.spreads = [];
              if (odds[j].outcomes[0].name === marketsObject.awayTeam) {
                marketsObject.spreads.push(odds[j].outcomes[0]);
                marketsObject.spreads.push(odds[j].outcomes[1]);
              } else {
                marketsObject.spreads.push(odds[j].outcomes[1]);
                marketsObject.spreads.push(odds[j].outcomes[0]);
              }
            } else if (odds[j].key === 'h2h') {
              marketsObject.h2h = [];
              if (odds[j].outcomes[0].name === marketsObject.awayTeam) {
                marketsObject.h2h.push(odds[j].outcomes[0]);
                marketsObject.h2h.push(odds[j].outcomes[1]);
              } else {
                marketsObject.h2h.push(odds[j].outcomes[1]);
                marketsObject.h2h.push(odds[j].outcomes[0]);
              }
            } else if (odds[j].key === 'totals') {
              marketsObject.totals = [];
              if (odds[j].outcomes[0].name === 'Over') {
                marketsObject.totals.push(odds[j].outcomes[0]);
                marketsObject.totals.push(odds[j].outcomes[1]);
              } else {
                marketsObject.totals.push(odds[j].outcomes[1]);
                marketsObject.totals.push(odds[j].outcomes[0]);
              }
            }
          }
          if (!marketsObject.spreads) {
            marketsObject.spreads = [];
            marketsObject.spreads.push({ name: 'N/A', price: 'N/A', point: 'N/A' });
            marketsObject.spreads.push({ name: 'N/A', price: 'N/A', point: 'N/A' });
          }
          if (!marketsObject.h2h) {
            marketsObject.h2h = [];
            marketsObject.h2h.push({ name: 'N/A', price: 'N/A' });
            marketsObject.h2h.push({ name: 'N/A', price: 'N/A' });
          }
          if (!marketsObject.totals) {
            marketsObject.totals = [];
            marketsObject.totals.push({ name: 'Under', price: 'N/A', point: 'N/A' });
            marketsObject.totals.push({ name: 'Over', price: 'N/A', point: 'N/A' });
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
                  <Table bordered className='table' key={elem.id}>
                    <thead>
                      <tr className="td-no-wrap td-quarter">
                        <th />
                        <th>Team</th>
                        <th>Spread</th>
                        <th>Line</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='td-no-wrap td-quarter'>
                        <td rowSpan="2" className="align-middle text-center">{elem.startTime.toLocaleDateString()}<br />{elem.startTime.toLocaleTimeString()}</td>
                        <td>{elem.awayTeam}</td>
                        <td>{elem.spreads[0].point} ({elem.spreads[0].price})</td>
                        <td>{elem.h2h[0].price}</td>
                        <td>O{elem.totals[0].point} ({elem.totals[0].price})</td>
                      </tr>
                      <tr className='td-no-wrap td-quarter'>
                        <td>{elem.homeTeam}</td>
                        <td>{elem.spreads[1].point} ({elem.spreads[1].price})</td>
                        <td>{elem.h2h[1].price}</td>
                        <td>U{elem.totals[1].point} ({elem.totals[1].price})</td>
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
