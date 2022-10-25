import React from 'react';
import Navbar from '../components/navbar';
import SubmitForm from '../components/submit-form';

export default class SignUp extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <SubmitForm />
      </>
    );
  }
}
