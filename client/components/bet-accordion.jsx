import Accordion from 'react-bootstrap/Accordion';
import React from 'react';
import BetTable from './bet-table';

export default class BetAccordion extends React.Component {
  render() {
    return (
      <Accordion variant='dark'>
        <Accordion.Item eventKey="0">
          <Accordion.Header>NFL Odds</Accordion.Header>
          <Accordion.Body>
            {
              this.props.nflOdds.map(elem => {
                return (
                  <BetTable elem={elem} key={elem.id} onClick={e => this.props.onClick(e, elem.startTime, 'nflOdds')} />
                );
              })
            }
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>NBA Odds</Accordion.Header>
          <Accordion.Body>
            {
              this.props.nbaOdds.map(elem => {
                return (
                  <BetTable elem={elem} key={elem.id} onClick={e => this.props.onClick(e, elem.startTime, 'nbaOdds')} />
                );
              })
            }
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>NBA Odds</Accordion.Header>
          <Accordion.Body>
            {
              this.props.mlbOdds.map(elem => {
                return (
                  <BetTable elem={elem} key={elem.id} onClick={e => this.props.onClick(e, elem.startTime, 'mlbOdds')} />
                );
              })
            }
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
}
