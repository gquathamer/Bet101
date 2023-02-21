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
    const nflPromise = fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
    const nbaPromise = fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
    const mlbPromise = fetch(`https://api.the-odds-api.com/v4/sports/baseball_mlb/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
    const ncaabPromise = fetch(`https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds?apiKey=${process.env.API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals&bookmakers=bovada`);
    const promiseArray = [nflPromise, nbaPromise, mlbPromise, ncaabPromise];
    Promise.all(promiseArray)
      .then(responses => {
        Promise.all(responses.map(promise => promise.json()))
          .then(results => {
            const nflOdds = createOddsArray(results[0]);
            const nbaOdds = createOddsArray(results[1]);
            const mlbOdds = createOddsArray(results[2]);
            const ncaabOdds = createOddsArray(results[3]);
            this.setState({
              odds: {
                nflOdds,
                nbaOdds,
                mlbOdds,
                ncaabOdds
              },
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
