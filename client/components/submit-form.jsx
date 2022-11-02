import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class SubmitForm extends React.Component {
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
    this.findFormErrors = this.findFormErrors.bind(this);
  }

  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({
        username: event.target.value
      });
    } else {
      this.setState({
        password: event.target.value
      });
    }
  }

  findFormErrors() {
    const { username, password } = this.state;

    const newErrors = {};

    if (!username || username === '') newErrors.username = 'username cannot be blank!';
    else if (username.length < 8) newErrors.username = 'username cannot be less than 8 characters';
    else if (username.length > 30) newErrors.username = 'username cannot be more than 30 characters';

    if (password.length < 8) newErrors.password = 'password length must be more than 8 letters, numbers, or characters';
    else if (password.length > 30) newErrors.password = 'password cannot contain more than 30 letters, numbers, or characters';
    else if (password.search(/\d/) === -1) newErrors.password = 'password does not contain at least one number';
    else if (password.search(/[a-zA-Z]/) === -1) newErrors.password = 'password does not contain at least one letter';
    else if (password.search(/[^a-zA-Z0-9!@#$%^&*()_+.,;:]/) !== -1) newErrors.password = 'password contains a bad character';

    return newErrors;
  }

  handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const newErrors = this.findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.username && newErrors.password) {
        this.setState({
          usernameError: newErrors.username,
          passwordError: newErrors.password
        });
      } else if (newErrors.username) {
        this.setState({
          usernameError: newErrors.username
        });
      } else if (newErrors.password) {
        this.setState({
          passwordError: newErrors.password
        });
      }
    } else {
      this.setState({
        validated: true,
        usernameError: '',
        passwordError: ''
      });
      const { username, password } = this.state;
      const data = {
        username,
        password
      };
      fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => {})
        .catch(err => console.error(err));
      form.reset();
    }
  }

  render() {

    return (
      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col lg={9}>
            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit} className="border border-dark rounded p-3">
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
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
