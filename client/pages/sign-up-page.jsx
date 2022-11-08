import React from 'react';
import Navigation from '../components/navbar';
import Oddsbar from '../components/odds-bar';
import SignUpForm from '../components/sign-up-form';

export default class SignUpPage extends React.Component {
  render() {
    return (
      <>
        <Navigation />
        <Oddsbar />
        <SignUpForm />
      </>
    );
  }
}
