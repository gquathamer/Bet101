import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AppContext from '../lib/app-context';

export default class LogInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      validated: false,
      usernameError: '',
      passwordError: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      [name + 'Error']: ''
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    if (username.trim() === '') {
      this.setState({
        usernameError: 'username cannot be blank!'
      });
      return;
    }
    if (password.trim() === '') {
      this.setState({
        passwordError: 'password cannot be blank!'
      });
      return;
    }
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
    return (
      <Row className="justify-content-center">
        <Col md={6} sm={9}>
          <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit} className="column-border p-3">
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
              <Col xs={8} sm={4} className="mb-3">
                <Button className="red-background" type="submit">
                  Log In
                </Button>
              </Col>
              <Col xs={12} sm={4}>
                <a href="#sign-up" className="auth-anchor">Need to Register?</a>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }
}

LogInForm.contextType = AppContext;
