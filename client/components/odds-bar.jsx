import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball, faFootball, faBaseball } from '@fortawesome/free-solid-svg-icons';

export default class Oddsbar extends React.Component {
  render() {
    return (
      <Navbar id='gray-color' className="d-none d-md-flex" expand="md" variant="light">
        <Container fluid="md">
          <Nav.Item>
            <Nav.Link href="#nfl" className="border-select">
              <Row>
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faFootball} />
                </Col>
                <Col>
                  <p className="nav-item-padding">NFL Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#nba" className="border-select">
              <Row>
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faBasketball} />
                </Col>
                <Col>
                  <p className="nav-item-padding">NBA Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#mlb" className="border-select">
              <Row>
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faBaseball} />
                </Col>
                <Col>
                  <p className="nav-item-padding">MLB Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#ncaab" className="border-select">
              <Row>
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faBasketball} />
                </Col>
                <Col>
                  <p className="nav-item-padding">NCAAB Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
        </Container>
      </Navbar>
    );
  }
}
