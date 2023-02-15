import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpPage from './pages/sign-up-page';
import LogInPage from './pages/log-in-page';
import NotFound from './pages/not-found';
import HomePage from './pages/home-page';
import AccountPage from './pages/account-page';
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
    this.setState({ user, token: jsonSignedToken });
  }

  handleSignOut() {
    window.localStorage.removeItem('bet101-jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '' || route.path === 'homepage' || route.path === 'nfl' || route.path === 'nba' || route.path === 'mlb') {
      return <HomePage sport={route.path}/>;
    }
    if (route.path === 'account-page') {
      return <AccountPage />;
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
    const contextValue = { user, route, token, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        {this.renderPage()}
      </AppContext.Provider>
    );
  }
}
