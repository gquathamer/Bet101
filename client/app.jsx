import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpPage from './pages/sign-up-page';
import LogInPage from './pages/log-in-page';
import NotFound from './pages/not-found';
import HomePage from './pages/home-page';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '' || route.path === 'sign-up' || route.path === 'home') {
      return <SignUpPage />;
    }
    if (route.path === 'log-in') {
      return <LogInPage />;
    }
    if (route.path === 'home-page') {
      return <HomePage/>;
    }
    return <NotFound />;
  }

  render() {
    return (
      <>
        { this.renderPage() }
      </>
    );
  }
}
