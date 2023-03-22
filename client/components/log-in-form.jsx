import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AppContext from '../lib/app-context';
import Redirect from './redirect';

export default class LogInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'testuser',
      password: 'password1234',
      validated: false,
      usernameError: '',
      passwordError: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { username, password } = this.state;

    const data = {
      username,
      password
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
        if (response.error) {
          response.error === 'invalid username'
            ? this.setState({ usernameError: response.error, passwordError: '' })
            : this.setState({ passwordError: response.error, usernameError: '' });
        } else if (response.user && response.jsonSignedToken) {
          this.context.handleSignIn(response);
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    const { user } = this.context;
    if (user) return <Redirect to="" />;

    return (
      <Container fluid="md" className="mt-5">
        <Row className="justify-content-center">
          <Col md={6} sm={9}>
            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit} className="border border-dark rounded p-3">
              <h2 className="text-center">Log In!</h2>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" required isInvalid={!!this.state.usernameError} />
                <Form.Control.Feedback type="invalid">
                  {this.state.usernameError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" required isInvalid={!!this.state.passwordError} />
                <Form.Control.Feedback type="invalid">
                  {this.state.passwordError}
                </Form.Control.Feedback>
              </Form.Group>
              <Row className="justify-content-between">
                <Col xs={4}>
                  <Button className="red-background white-color" type="submit">
                    Log In
                  </Button>
                </Col>
                <Col className="text-end">
                  <a href="#sign-up" className="auth-anchor">Need to Register?</a>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

LogInForm.contextType = AppContext;
