import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import LogInForm from '../components/log-in-form';

export default class SignUpPage extends React.Component {
  render() {
    return (
      <>
        <Navigation />
        <Oddsbar />
        <LogInForm />
      </>
    );
  }
}
