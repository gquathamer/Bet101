import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball, faFootball, faBaseball, faHouse } from '@fortawesome/free-solid-svg-icons';
import AppContext from '../lib/app-context';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0
    };
  }

  componentDidMount() {
    fetch('/api/account-balance', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          accountBalance: parseFloat(response.accountBalance)
        });
      });
  }

  render() {
    return (
      <Navbar collapseOnSelect className="dark-color" expand="md" variant="dark">
        <Container>
          <Navbar.Brand href="#info">Bet101</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="d-none d-md-flex">
              <Nav.Link href="#homepage">Home</Nav.Link>
              <Nav.Link href="#account-page">My Bets</Nav.Link>
              <p className="text-center navbar-white-color nav-item-padding"><span className='green-color p-2'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.accountBalance)}</span></p>
            </Nav>
            <Nav className="d-md-none">
              <Nav.Link href="#homepage">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faHouse} />
                  </Col>
                  <Col>
                    <p>Home</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link href="#nfl">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faFootball} />
                  </Col>
                  <Col>
                    <p>NFL Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link href="#nba">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faBasketball} />
                  </Col>
                  <Col>
                    <p>NBA Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link href="#mlb">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faBaseball} />
                  </Col>
                  <Col>
                    <p>MLB Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link href="#ncaab">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faBasketball} />
                  </Col>
                  <Col>
                    <p>NCAAB Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Row>
                <Col>
                  <Nav.Link href="#account-page">
                    <h5 className="text-center navbar-white-color">My Bets</h5>
                  </Nav.Link>
                </Col>
                <Col>
                  <Nav.Link>
                    <h5 className="text-center"><span className='green-color p-2'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.accountBalance)}</span></h5>
                  </Nav.Link>
                </Col>
              </Row>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

Navigation.contextType = AppContext;
