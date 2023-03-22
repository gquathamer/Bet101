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
  render() {
    let accountBalance;
    this.props.accountBalance ? accountBalance = this.props.accountBalance : accountBalance = 0;
    return (
      <Navbar collapseOnSelect className="dark-color" expand="md" variant="dark">
        <Container>
          <Navbar.Brand href="#info">Bet101</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="d-none d-md-flex">
              <Nav.Link active={!!(this.props.activeNavLink === '' || this.props.activeNavLink === 'homepage')} href="#homepage">Home</Nav.Link>
              <Nav.Link active={!!(this.props.activeNavLink === 'account-page')} href="#account-page">My Bets</Nav.Link>
              <p className="text-center navbar-white-color nav-item-padding"><span className='green-color p-2'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(accountBalance)}</span></p>
            </Nav>
            <Nav className="d-md-none">
              <Nav.Link active={!!(this.props.activeNavLink === '' || this.props.activeNavLink === 'homepage')} href="#homepage">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faHouse} />
                  </Col>
                  <Col>
                    <p>Home</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link active={!!(this.props.activeNavLink === 'nfl')} href="#nfl">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faFootball} />
                  </Col>
                  <Col>
                    <p>NFL Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link active={!!(this.props.activeNavLink === 'nba')} href="#nba">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faBasketball} />
                  </Col>
                  <Col>
                    <p>NBA Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link active={!!(this.props.activeNavLink === 'mlb')} href="#mlb">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faBaseball} />
                  </Col>
                  <Col>
                    <p>MLB Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link active={!!(this.props.activeNavLink === 'ncaab')} href="#ncaab">
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
                  <Nav.Link active={!!(this.props.activeNavLink === 'account-page')} href="#account-page">
                    <p className="text-center">My Bets</p>
                  </Nav.Link>
                </Col>
                <Col>
                  <Nav.Link>
                    <p className="text-center"><span className='green-color p-2'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(accountBalance)}</span></p>
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
