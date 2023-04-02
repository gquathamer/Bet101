import React from 'react';
import Table from 'react-bootstrap/Table';
import { abbreviationsObject } from '../lib/abbreviations';

export default class BetTable extends React.Component {
  render() {
    return (
      <Table fluid="md" className="mt-5 accordion-bet-table" onClick={this.props.onClick} bordered id={this.props.elem.id}>
        <thead>
          <tr className="td-quarter">
            <th>Date</th>
            <th>Team</th>
            <th>Spread</th>
            <th>Line</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr className='td-no-wrap td-quarter'>
            <td rowSpan="2" className="align-middle text-center">{this.props.elem.startTime.toLocaleDateString()}<br />{this.props.elem.startTime.toLocaleTimeString(('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))}</td>
            <td>
              <span className='abbreviated-text'>{abbreviationsObject[this.props.elem.awayTeam]} </span>
              <span className='full-text'>{this.props.elem.awayTeam} </span>
            </td>
            <td className="cursor-pointer spread away">{this.props.elem.spreads[0].point > 0 ? '+' : ''}{this.props.elem.spreads[0].point} ({this.props.elem.spreads[0].price > 0 ? '+' : ''}{this.props.elem.spreads[0].price})</td>
            <td className="cursor-pointer moneyline away">{this.props.elem.h2h[0].price > 0 ? '+' : ''}{this.props.elem.h2h[0].price}</td>
            <td className="cursor-pointer total over">O {this.props.elem.totals[0].point} ({this.props.elem.totals[0].price > 0 ? '+' : ''}{this.props.elem.totals[0].price})</td>
          </tr>
          <tr className='td-no-wrap td-quarter'>
            <td>
              <span className='abbreviated-text'> {abbreviationsObject[this.props.elem.homeTeam]} </span>
              <span className='full-text'> {this.props.elem.homeTeam} </span>
            </td>
            <td className="cursor-pointer spread home">{this.props.elem.spreads[1].point > 0 ? '+' : ''}{this.props.elem.spreads[1].point} ({this.props.elem.spreads[1].price > 0 ? '+' : ''}{this.props.elem.spreads[1].price})</td>
            <td className="cursor-pointer moneyline home">{this.props.elem.h2h[1].price > 0 ? '+' : ''}{this.props.elem.h2h[1].price}</td>
            <td className="cursor-pointer total under">U {this.props.elem.totals[1].point} ({this.props.elem.totals[1].price > 0 ? '+' : ''}{this.props.elem.totals[1].price})</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
