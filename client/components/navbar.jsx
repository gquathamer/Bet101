import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Column from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default class Navbar extends React.Component {
  render() {
    return (
      <Container>
        <Row className="navbar">
          <Column xs={1}>
            <h1>
              Bet101
            </h1>
          </Column>
          <Column xs={1}>
            <FontAwesomeIcon size="2xl" icon={faBars} />
          </Column>
        </Row>
      </Container>
    );
  }
}
