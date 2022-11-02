import React from 'react';
import Navigation from '../components/navbar';
import SubmitForm from '../components/submit-form';

export default class SignUp extends React.Component {
  render() {
    return (
      <>
        <Navigation />
        <SubmitForm />
      </>
    );
  }
}
