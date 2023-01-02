import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpPage from './pages/sign-up-page';
import LogInPage from './pages/log-in-page';
import NotFound from './pages/not-found';
import HomePage from './pages/home-page';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import jwtDecode from 'jwt-decode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      token: null,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('bet101-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false, token });
  }

  handleSignIn(result) {
    const { user, jsonSignedToken } = result;
    window.localStorage.setItem('bet101-jwt', jsonSignedToken);
    window.location.hash = '#home-page';
    this.setState({ user, token: jsonSignedToken });
  }

  handleSignOut() {
    window.localStorage.removeItem('bet101-jwt');
    this.setState({ user: null });
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
    if (this.state.isAuthorizing) return null;
    const { user, route, token } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut, token };
    return (
      <AppContext.Provider value={contextValue}>
        {this.renderPage()}
      </AppContext.Provider>
    );
  }
}
