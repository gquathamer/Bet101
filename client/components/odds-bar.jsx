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
      <Navbar className="d-none d-md-flex gray-background" expand="md" variant="light">
        <Container fluid="md">
          <Nav.Item>
            <Nav.Link href="#nfl" className={this.props.activeNavLink === 'nfl' ? 'current-odds border-select' : 'border-select'}>
              <Row className="align-items-center">
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faFootball} />
                </Col>
                <Col>
                  <p className="oddsbar-item">NFL Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#nba" className={this.props.activeNavLink === 'nba' ? 'current-odds border-select' : 'border-select'}>
              <Row className="align-items-center">
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faBasketball} />
                </Col>
                <Col>
                  <p className="oddsbar-item">NBA Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#mlb" className={this.props.activeNavLink === 'mlb' ? 'current-odds border-select' : 'border-select'}>
              <Row className="align-items-center">
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faBaseball} />
                </Col>
                <Col>
                  <p className="oddsbar-item">MLB Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#ncaab" className={this.props.activeNavLink === 'ncaab' ? 'current-odds border-select' : 'border-select'}>
              <Row className="align-items-center">
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faBasketball} />
                </Col>
                <Col>
                  <p className="oddsbar-item">NCAAB Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
        </Container>
      </Navbar>
    );
  }
}
