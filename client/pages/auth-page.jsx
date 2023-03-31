import React from 'react';
import LogInForm from '../components/log-in-form';
import SignUpForm from '../components/sign-up-form';
import AppContext from '../lib/app-context';
import DemoButton from '../components/demo-user-button';

export default class AuthPage extends React.Component {
  render() {
    let pageContent;
    this.context.route.path === 'log-in'
      ? pageContent = <LogInForm/>
      : pageContent = <SignUpForm/>;
    return (
      <>
        { pageContent }
        <DemoButton />
      </>
    );
  }
}

AuthPage.contextType = AppContext;
