import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class Footer extends React.Component {
  render() {
    return (
      <Navbar className="dark-color" expand="md" variant="dark">
        <Row>
          <Col xs={3}>
            <Navbar.Brand>
              Bet101
            </Navbar.Brand>
            <Nav>
              <Nav.Item>
                <Nav.Link href="homepage">Home</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Navbar>
    );
  }
}
