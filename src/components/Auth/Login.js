import React, { Component } from 'react';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  isFormValid = ({ email, password }) => email && password;
  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.isFormValid(this.state)) return;
    this.setState({ errors: [], loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        console.log(user);
        this.setState({ loading: false })
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          errors: this.state.errors.concat(e),
          loading: false
        })
      });
  };
  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);
  render() {
    const { email, password, loading } = this.state;
    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' icon color='violet' textAlign='center'>
            <Icon name='code branch' color='violet' />
            Login
          </Header>
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                type='email'
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email'
                onChange={this.handleChange}
                value={email}
              />
              <Form.Input
                fluid
                type='password'
                name='password'
                icon='lock'
                value={password}
                iconPosition='left'
                placeholder='Password'
                onChange={this.handleChange}
              />
              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                color='violet'
                fluid
                size='large'
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(this.state.errors)}
            </Message>
          )}
          <Message>
            Don't have an account?<Link to='/register'>Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
