import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';

export default class Footer extends React.Component {
  render() {
    return (
      <Navbar className="dark-color position-static bottom-0" expand="md" variant="dark">
        <Container className="d-block">
          <Nav className="d-flex flex-row align-items-center justify-content-center footer-text mx-auto my-3">
            <Navbar.Brand href="#info" className="pl-1" sm={1}>
              Bet101
            </Navbar.Brand>
            <Nav.Item sm={1}>
              <Nav.Link active={!!(this.props.activeNavLink === 'homepage' || this.props.activeNavLink === '')} href="#homepage">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item sm={1}>
              <Nav.Link active={!!(this.props.activeNavLink === 'account-page')} href="#account-page">My Bets</Nav.Link>
            </Nav.Item>
            <Nav.Item sm={1}>
              <Nav.Link active={!!(this.props.activeNavLink === 'nfl')} href="#nfl">NFL Odds</Nav.Link>
            </Nav.Item>
            <Nav.Item sm={1}>
              <Nav.Link active={!!(this.props.activeNavLink === 'nba')} href="#nba">NBA Odds</Nav.Link>
            </Nav.Item>
            <Nav.Item sm={1}>
              <Nav.Link active={!!(this.props.activeNavLink === 'mlb')} href="#mlb">MLB Odds</Nav.Link>
            </Nav.Item>
            <Nav.Item sm={1}>
              <Nav.Link active={!!(this.props.activeNavLink === 'ncaab')} href="#ncaab">NCAAB Odds</Nav.Link>
            </Nav.Item>
          </Nav>
          <hr className="white-icons" />
          <Nav className="d-flex flex-row align-items-center justify-content-center footer-text mx-auto my-3">
            <Col sm={1} className="p-2 text-center">
              <FontAwesomeIcon className="white-icons" size="xl" icon={faFacebook} />
            </Col>
            <Col sm={1} className="p-2 text-center">
              <FontAwesomeIcon className="white-icons" size="xl" icon={faInstagram} />
            </Col>
            <Col sm={1} className="p-2 text-center">
              <FontAwesomeIcon className="white-icons" size="xl" icon={faTwitter} />
            </Col>
            <Col sm={1} className="p-2 text-center">
              <FontAwesomeIcon className="white-icons" size="xl" icon={faGithub} />
            </Col>
            <Col sm={1} className="p-2 text-center">
              <FontAwesomeIcon className="white-icons" size="xl" icon={faDiscord} />
            </Col>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}
