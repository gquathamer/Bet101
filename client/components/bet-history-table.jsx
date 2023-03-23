import React from 'react';
import { abbreviationsObject } from '../lib/abbreviations';
import Table from 'react-bootstrap/Table';

export default class BetHistoryTable extends React.Component {
  render() {
    return (
      <Table bordered className='mt-5' id='bet-history-table' fluid="md">
        <thead>
          <tr className="td-no-wrap">
            <th className='align-middle table-data-20'>Placed Date</th>
            <th className="table-data-40">Bet</th>
            <th className="table-data-20">Action</th>
            <th className="table-data-20">Status</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.betHistory.map(elem => {
              let homeTeamScoreColor;
              let awayTeamScoreColor;
              if (elem.homeTeamScore > elem.awayTeamScore) {
                homeTeamScoreColor = 'winning-score';
                awayTeamScoreColor = 'losing-score';
              } else {
                awayTeamScoreColor = 'winning-score';
                homeTeamScoreColor = 'losing-score';
              }
              let betStatusColor;
              let operator;
              if (elem.status === 'won') {
                betStatusColor = 'green-color';
                operator = '+';
              } else if (elem.status === 'lost') {
                betStatusColor = 'red-color';
                operator = '-';
              } else if (elem.status === 'tied') {
                betStatusColor = 'white-color';
                operator = '';
              } else {
                betStatusColor = 'white-color';
                operator = '-';
              }
              let info;
              !elem.betId
                ? info = <>
                  <td className="align-middle">{new Date(elem.createdAt).toLocaleDateString()}</td>
                  <td className='double-line-height'>DEPOSIT</td>
                  <td><span className="green-color">+{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(elem.depositAmount)}</span></td>
                  <td>N/A</td>
                </>
                : info = <>
                  <td className="align-middle">{new Date(elem.createdAt).toLocaleDateString()}</td>
                  <td id="bet-history-game-details" className="double-line-height">
                    <span>
                      {new Date(elem.gameStart).toLocaleDateString()}: {new Date(elem.gameStart).toLocaleTimeString()}
                      <br />
                      <span className='abbreviated-text'>{abbreviationsObject[elem.awayTeam]}</span>
                      <span className='full-text'>{elem.awayTeam}</span>
                      : <span className={awayTeamScoreColor}>{elem.awayTeamScore} </span>
                      @
                      <span className='abbreviated-text'> {abbreviationsObject[elem.homeTeam]}</span>
                      <span className='full-text'> {elem.homeTeam}</span>
                      : <span className={homeTeamScoreColor}>{elem.homeTeamScore}</span>
                      <br />
                    </span>
                    <span className='abbreviated-text'> {abbreviationsObject[elem.winningTeam]}: </span>
                    <span className='full-text'> {elem.winningTeam}: </span>
                    {elem.betType !== 'total' ? elem.betType.charAt(0).toUpperCase() + elem.betType.slice(1) : ''} {elem.points > 0 ? '+' : ''}{elem.points} ({elem.price > 0 ? '+' : ''}{elem.price})
                  </td>
                  <td>
                    <span className={betStatusColor}>{operator}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(betStatusColor === 'green-color' ? elem.potentialWinnings : elem.betAmount)}</span>
                  </td>
                  <td>
                    <span className={betStatusColor}>{elem.status}</span>
                  </td>
                </>;

              return (
                <tr className='td-no-wrap td-quarter' key={elem?.gameId + elem?.betId || elem?.depositId}>
                  { info }
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    );
  }
}