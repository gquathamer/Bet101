import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpPage from './pages/sign-up-page';
import LogInPage from './pages/log-in-page';
import NotFound from './pages/not-found';
import HomePage from './pages/home-page';
import AccountPage from './pages/account-page';
import InfoPage from './pages/info-page';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import jwtDecode from 'jwt-decode';
import createOddsArray from './lib/create-odds-array';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      token: null,
      odds: null,
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
    fetch('/api/odds')
      .then(response => response.json())
      .then(response => {
        const { nflOdds, nbaOdds, mlbOdds, ncaabOdds } = response;
        this.setState({
          odds: {
            nflOdds: createOddsArray(nflOdds),
            nbaOdds: createOddsArray(nbaOdds),
            mlbOdds: createOddsArray(mlbOdds),
            ncaabOdds: createOddsArray(ncaabOdds)
          },
          user,
          isAuthorizing: false,
          token
        });
      });
  }

  handleSignIn(result) {
    const { user, jsonSignedToken, accountBalance } = result;
    window.localStorage.setItem('bet101-jwt', jsonSignedToken);
    this.setState({ user, token: jsonSignedToken, accountBalance });
  }

  handleSignOut() {
    window.localStorage.removeItem('bet101-jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '' || route.path === 'homepage' || route.path === 'nfl' || route.path === 'nba' || route.path === 'mlb' || route.path === 'ncaab') {
      return <HomePage odds={this.state.odds} hash={this.state.route.path}/>;
    }
    if (route.path === 'account-page') {
      return <AccountPage hash={this.state.route.path}/>;
    }
    if (route.path === 'info') {
      return <InfoPage hash={this.state.route.path}/>;
    }
    if (route.path === 'log-in') {
      return <LogInPage hash={this.state.route.path}/>;
    }
    if (route.path === 'sign-up') {
      return <SignUpPage hash={this.state.route.path}/>;
    }
    return <NotFound />;
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route, token, odds } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, token, handleSignIn, handleSignOut, odds };
    return (
      <AppContext.Provider value={contextValue}>
        {this.renderPage()}
      </AppContext.Provider>
    );
  }
}
