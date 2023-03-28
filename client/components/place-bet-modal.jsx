import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import AppContext from '../lib/app-context';

export default class PlaceBetModal extends React.Component {

  render() {
    return (
      <Modal show={this.props.data.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Place Bet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={this.props.data.validated} onSubmit={this.props.handleSubmit}>
            <p>{this.props.data.awayTeam} @ {this.props.data.homeTeam}</p>
            <p>{new Date(this.props.data.gameStart).toLocaleDateString()} {new Date(this.props.data.gameStart).toLocaleTimeString()}</p>
            <p>
              {`
                  ${this.props.data.winningTeam}:
                  ${this.props.data.betType.charAt(0).toUpperCase() + this.props.data.betType.slice(1)}
                  ${this.props.data.betPoints > 0 ? '+' : ''}${this.props.data.betPoints === undefined ? '' : this.props.data.betPoints}
                  (${this.props.data.betOdds > 0 ? '+' : ''}${this.props.data.betOdds})
                `}
            </p>
            <Form.Group className="mb-3" controlId="betAmount">
              <Form.Label>Bet Amount (<span className='green-color'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.context.accountBalance)})</span></Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="betAmount"
                  required
                  isInvalid={!!this.props.data.formFeedback}
                  autoFocus
                  onChange={this.props.handleBetAmountChange}
                  value={this.props.data.betAmount}
                />
                <Form.Control.Feedback type="invalid">
                  {this.props.data.formFeedback}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="potentialEarnings">
              <Form.Label>Winnings</Form.Label>
              <Form.Control
                type="text"
                value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.props.data.potentialWinnings)}
                disabled
              />
            </Form.Group>
            <Button type="submit" className="red-background">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

PlaceBetModal.contextType = AppContext;
