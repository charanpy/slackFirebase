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
import md5 from 'md5';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    errors: [],
    loading: false,
    userRef: firebase.database().ref('users')
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  isFormEmpty = ({ email, password, username, passwordConfirm }) => {
    return (
      !email.length ||
      !password.length ||
      !username.length ||
      !passwordConfirm.length
    );
  };

  isPasswordValid = ({ password, passwordConfirm }) => {
    if (!password.length || !passwordConfirm.length) return false;
    else if (password !== passwordConfirm) return false;
    return true;
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) });
    } else {
      return true;
    }
  };

  saveUser = (createdUser) => {
    this.state.userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.isFormValid()) return;
    this.setState({ errors: [], loading: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userDetails) => {
        userDetails.user.updateProfile({
          displayName: this.state.username,
          photoURL: `http://gravatar.com/avatar/${md5(userDetails.user.email)}?d=identicon`
        })
        .then(() => {
          this.setState({ loading: false});  
          this.saveUser(userDetails).then(() => {
            console.log('user saved')
          }) 
        }).catch(() => this.setState({ loading: false}))        
      })
      .catch((e) => {
        console.log(e);
        this.setState({ loading: false })
      });
  };
  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);
  render() {
    const { email, password, username, passwordConfirm, loading } = this.state;
    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' icon color='orange' textAlign='center'>
            <Icon name='puzzle piece' color='orange' />
            Register
          </Header>
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                type='text'
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='username'
                onChange={this.handleChange}
                value={username}
              />
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
              <Form.Input
                fluid
                value={passwordConfirm}
                type='password'
                name='passwordConfirm'
                icon='repeat'
                iconPosition='left'
                placeholder='Confirm Password'
                onChange={this.handleChange}
              />
              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                color='orange'
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
            Already a user?<Link to='/login'>Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
