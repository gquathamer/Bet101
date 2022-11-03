import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball, faFootball, faBaseball } from '@fortawesome/free-solid-svg-icons';

export default class Navigation extends React.Component {
  render() {
    return (
      <Navbar className="dark-color" expand="md" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Bet101</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <Nav className="d-none d-md-flex">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#log-in">Log In</Nav.Link>
              <Nav.Link href="#sign-up">Sign Up</Nav.Link>
              <Nav.Link href="#link">Bet101</Nav.Link>
            </Nav>
            <Nav className="d-md-none">
              <Nav.Link href="#home">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faFootball} />
                  </Col>
                  <Col>
                    <p>Football Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link href="#home">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faBasketball} />
                  </Col>
                  <Col>
                    <p>Basketball Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link href="#home">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faBaseball} />
                  </Col>
                  <Col>
                    <p>Baseball Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Row>
                <Col>
                  <Nav.Link href="#sign-up">
                    <h5 className="text-center">Sign Up</h5>
                  </Nav.Link>
                </Col>
                <Col>
                  <Nav.Link href="#log-in">
                    <h5 className="text-center">Log In</h5>
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
