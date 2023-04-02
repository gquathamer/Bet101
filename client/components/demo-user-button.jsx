import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AppContext from '../lib/app-context';

export default class DemoButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const data = {
      username: 'testuser',
      password: 'password1234'
    };
    fetch('/api/auth/log-in', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(response => {
        this.context.handleSignIn(response);
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <Row className="justify-content-center mt-5">
        <Col md={6} sm={9}>
          <Form noValidate onSubmit={this.handleSubmit}>
            <Button id="demo-user-button" type="Submit">One Click Demo User</Button>
          </Form>
        </Col>
      </Row>
    );
  }
}

DemoButton.contextType = AppContext;
