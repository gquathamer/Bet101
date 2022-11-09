import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      odds: ''
    };
  }

  componentDidMount() {
    fetch('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=' + process.env.ODDS_API_KEY + '&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada')
      .then(response => response.json())
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
          <Row className="justify-content-center">
            <Col md={6} sm={9}>
              {
                this.state.odds.map(elem => {
                  return <h1 key={elem.id}>elem.home_team</h1>;
                })
              }
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
