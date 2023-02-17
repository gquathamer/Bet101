import Accordion from 'react-bootstrap/Accordion';
import React from 'react';
import BetTable from './bet-table';

export default class BetAccordion extends React.Component {
  render() {
    const noOdds = <h1 className="text-center mtb-3">This sport must be out of season!</h1>;
    return (
      <Accordion>
        <Accordion.Item eventKey="0" className="first-accordion-item">
          <Accordion.Header>NFL Odds</Accordion.Header>
          <Accordion.Body>
            {
              this.props.nflOdds.length > 0
                ? this.props.nflOdds.map(elem => {
                  return (
                    <BetTable elem={elem} key={elem.id} onClick={e => this.props.onClick(e, elem.startTime, 'nflOdds')} />
                  );
                })
                : noOdds
            }
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="accordion-item">
          <Accordion.Header>NBA Odds</Accordion.Header>
          <Accordion.Body>
            {
              this.props.nbaOdds.length > 0
                ? this.props.nbaOdds.map(elem => {
                  return (
                    <BetTable elem={elem} key={elem.id} onClick={e => this.props.onClick(e, elem.startTime, 'nbaOdds')} />
                  );
                })
                : noOdds
            }
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" className="accordion-item">
          <Accordion.Header>MLB Odds</Accordion.Header>
          <Accordion.Body>
            {
              this.props.mlbOdds.length > 0
                ? this.props.mlbOdds.map(elem => {
                  return (
                    <BetTable elem={elem} key={elem.id} onClick={e => this.props.onClick(e, elem.startTime, 'mlbOdds')} />
                  );
                })
                : noOdds
            }
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
}
