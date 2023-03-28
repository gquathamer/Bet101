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
import Oddsbar from './components/odds-bar';
import Navigation from './components/navbar';
import Footer from './components/footer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      token: null,
      odds: null,
      accountBalance: 0,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.updateAccountBalance = this.updateAccountBalance.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('bet101-jwt');
    const user = token ? jwtDecode(token) : null;
    const accountBalancePromise = fetch('/api/account-balance', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': token
      }
    });
    const oddsPromise = fetch('/api/odds');
    const promiseArray = [accountBalancePromise, oddsPromise];
    Promise.all(promiseArray)
      .then(responses => {
        Promise.all(responses.map(promise => promise.json()))
          .then(results => {
            const { accountBalance } = results[0];
            const { nflOdds, nbaOdds, mlbOdds, ncaabOdds } = results[1];
            this.setState({
              odds: {
                nflOdds: createOddsArray(nflOdds),
                nbaOdds: createOddsArray(nbaOdds),
                mlbOdds: createOddsArray(mlbOdds),
                ncaabOdds: createOddsArray(ncaabOdds)
              },
              accountBalance: parseFloat(accountBalance),
              user,
              isAuthorizing: false,
              token
            });
          });
      })
      .catch(err => console.error(err));
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

  updateAccountBalance(newBalance) {
    this.setState({
      accountBalance: parseFloat(newBalance)
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '' || route.path === 'homepage' || route.path === 'nfl' || route.path === 'nba' || route.path === 'mlb' || route.path === 'ncaab') {
      return <HomePage odds={this.state.odds}/>;
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
    const { user, route, token, odds, accountBalance } = this.state;
    const { handleSignIn, handleSignOut, updateAccountBalance } = this;
    const contextValue = { user, route, token, handleSignIn, handleSignOut, odds, accountBalance, updateAccountBalance };
    return (
      <AppContext.Provider value={contextValue}>
        <Navigation accountBalance={this.state.accountBalance} activeNavLink={this.state.route.path} />
        <Oddsbar activeNavLink={this.state.route.path} />
        <div className='content'>
          {this.renderPage()}
        </div>
        <Footer activeNavLink={this.state.route.path} className='footer' />
      </AppContext.Provider>
    );
  }
}
