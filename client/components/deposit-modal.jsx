import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import AppContext from '../lib/app-context';

export default class DepositModal extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Deposit More $$$</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={this.props.validated} onSubmit={this.props.handleSubmit}>
            <p><strong>Balance + Deposit not to exceed $10,000</strong></p>
            <Form.Group className="mb-3">
              <Form.Label>Deposit Amount: (<span className='green-color'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.context.accountBalance)})</span></Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control required type="text" onChange={this.props.onChange} value={this.props.value} isInvalid={this.props.isInvalid} />
                <Form.Control.Feedback type="invalid">{this.props.formFeedback}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button type="submit" id="deposit-submit-button">
              $$$
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

DepositModal.contextType = AppContext;
