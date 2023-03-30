import React from 'react';
import LogInForm from '../components/log-in-form';
import SignUpForm from '../components/sign-up-form';
import AppContext from '../lib/app-context';
import DemoButton from '../components/demo-user-button';
import Redirect from '../components/redirect';

export default class AuthPage extends React.Component {
  render() {
    const { user } = this.context;
    if (user) return <Redirect to="" />;
    let pageContent;
    this.context.route.path === 'log-in'
      ? pageContent = <LogInForm />
      : pageContent = <SignUpForm />;
    return (
      <>
        { pageContent }
        <DemoButton />
      </>
    );
  }
}

AuthPage.contextType = AppContext;
