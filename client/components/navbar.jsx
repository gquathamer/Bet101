import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball, faFootball, faBaseball } from '@fortawesome/free-solid-svg-icons';
import AppContext from '../lib/app-context';

export default class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accountBalance: ''
    };
  }

  render() {
    return (
      <Navbar className="dark-color" expand="md" variant="dark">
        <Container>
          <Navbar.Brand href="#home-page">Bet101</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <Nav className="d-none d-md-flex">
              <Nav.Link href="#link">Bet101</Nav.Link>
              <Nav.Link href="#home-page">Home</Nav.Link>
              <p className="text-center navbar-white-color nav-item-padding">Account Balance: <br/>${this.props.accountBalance}</p>
            </Nav>
            <Nav className="d-md-none">
              <Nav.Link href="#home-page">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faFootball} />
                  </Col>
                  <Col>
                    <p>Football Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link href="#basketball">
                <Row className="border-bottom">
                  <Col xs={3} className="text-center">
                    <FontAwesomeIcon size="2xl" icon={faBasketball} />
                  </Col>
                  <Col>
                    <p>Basketball Odds</p>
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link href="#baseball">
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
                  <h5 className="text-center navbar-white-color">Account Balance: ${this.props.accountBalance}</h5>
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
