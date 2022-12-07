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
      <Navbar className="gray-color d-none d-md-flex" expand="md" variant="light">
        <Container fluid="md">
          <Nav.Item>
            <Nav.Link href="#home-page">
              <Row>
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faFootball} />
                </Col>
                <Col>
                  <p>Football Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#basketball">
              <Row>
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faBasketball} />
                </Col>
                <Col>
                  <p>Basketball Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#baseball">
              <Row>
                <Col md={3}>
                  <FontAwesomeIcon size="2xl" icon={faBaseball} />
                </Col>
                <Col>
                  <p>Baseball Odds</p>
                </Col>
              </Row>
            </Nav.Link>
          </Nav.Item>
        </Container>
      </Navbar>
    );
  }
}
