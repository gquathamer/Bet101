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
    if (route.path === '' || route.path === 'home-page') {
      return <HomePage sport="americanfootball_nfl"/>;
    }
    if (route.path === 'basketball') {
      return <HomePage sport='basketball_nba'/>;
    }
    if (route.path === 'baseball') {
      return <HomePage sport='baseball_mlb'/>;
    }
    if (route.path === 'log-in') {
      return <LogInPage />;
    }
    if (route.path === 'sign-up') {
      return <SignUpPage />;
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
