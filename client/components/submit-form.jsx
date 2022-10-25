import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  render() {
    return (
      <Container className="mt-3">
        <Form className="border border-dark rounded p-3">
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control type="text" value={this.state.username} onChange={this.handleChange} />
            <Form.Text className="text-muted">
              Username must be 8 alphanumeric characters long
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" placeholder="Password" />
            <Form.Text className="text-muted">
              Password must be 8 characters long and include 1 letter and 1 number
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Form>
      </Container>
    );
  }
}
