import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Navigation from '../components/navbar';
import oddsImage from '../images/odds.png';
import firstTwo from '../images/first2.png';
import lastThree from '../images/last3.png';
import moneyline from '../images/moneyline.png';
import spread from '../images/spread.png';
import finalScore from '../images/finalScore.png';
import total from '../images/totals.png';
import Footer from '../components/footer';
import PlaceBetGIF from '../images/placeBet.gif';
import depositFundsGIF from '../images/depositFunds.gif';
import AppContext from '../lib/app-context';

export default class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0
    };
  }

  componentDidMount() {
    if (!this.context.token) {
      return;
    }
    fetch('/api/account-balance', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-access-token': this.context.token
      }
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          accountBalance: parseFloat(response.accountBalance)
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <>
        <Navigation accountBalance={this.state.accountBalance}/>
        <div className="container">
          <Container className="my-5" fluid="md">
            <Row>
              <h1>What is Bet101?</h1>
              <p>
                {
                  `Bet101 is designed for sports betting beginners.
                  Bet101 allows you to bet on real games using fake money. This page will go over the basics of sports betting and how to place your first bet.`
                }
              </p>
            </Row>
            <br />
            <Row>
              <h1>How To Read Odds</h1>
              <p>
                {
                  'To place a bet you need to understand some basics about odds. For every game you can place a bet on you will see \'the line\' which looks like this:'
                }
              </p>
              <Row className="justify-content-center">
                <Col md={9} className="text-center mb-3">
                  <img src={oddsImage} />
                </Col>
              </Row>
              <p>
                {
                  `From left to right we'll take a look at each section and understand what it means.
                  The first 2 sections are the date the game will be played, and the teams that will be playing:`
                }
              </p>
              <Row className="justify-content-center">
                <Col md={6} className="text-center mb-3">
                  <img src={firstTwo} />
                </Col>
              </Row>
              <p>
                The next 3 sections contain odds for 3 different kinds of bets.
              </p>
              <Row>
                <ul className="info-page-list">
                  <li><i>Spread Bets</i></li>
                  <li><i>Moneyline (Win) Bets</i></li>
                  <li><i>Total Bets</i></li>
                </ul>
              </Row>
              <Row className="justify-content-center mb-3">
                <Col className="text-center" md={6}>
                  <img src={lastThree} />
                </Col>
              </Row>
              <br />
            </Row>
            <br />
            <Row>
              <h1>Moneyline (Win) Bets</h1>
              <Row className="justify-content-center">
                <Col className="text-center mb-3" md={3}>
                  <img src={moneyline} />
                </Col>
              </Row>
              <br />
              <p>
                {
                  `A moneyline (win) bet is the simplest bet to wrap your head around. You are picking the winner of a game. The plus sign indicates an underdog and the minus sign
                indicates a favorite. Every moneyline bet will have a plus and a minus sign (an underdog and a favorite).`
                }
              </p>
              <p>
                {
                  `The numbers themselves indicate the potential winnings of you placing a bet on that team. Whether you place a bet on the underdog or on the favorite will have
                consquences for your potential winnings. For example, let's say you placed a $100 bet on  the underdog, Dartmouth. The payout for that bet would be $390. You'd walk away
                with $490 ($390 + your original $100 bet). Whenever you see a plus sign in front of a number think of that as your potential winnings if you bet $100.`
                }
              </p>
              <p>
                {
                  `The favorite works a little bit differently. You can think of the minus sign in front of a number as how much you'd have to bet in order to win
                $100. So if you wanted to win $100 by placing a moneyline bet on Cornell you'd need to bet $550.`
                }
              </p>
              <p>
                {
                  `The payout for the underdog is quite lucrative when considering the same amount on the favorite yields much less. This is by design. The sportsbooks that create
                these odds are trying to balance their books. Sportsbooks make their money when half of the bets are on either side of
                a line. So if 50% of the money is on Dartmouth to win and the other 50% is on Cornell to win that's a good day for the sportsbook. The underdog odds are
                designed to lure you in with high potential payouts, but the favorite is a favorite for good reason. However, there is no downside to going all in on an underdog in Bet101
                since this is fake money!`
                }
              </p>
            </Row>
            <Row>
              <h1>Spread Bets</h1>
              <br />
              <Row className="justify-content-center">
                <Col className="text-center mb-3" md={3}>
                  <img src={spread} />
                </Col>
              </Row>
              <p>
                {
                  `A spread bet is a little more complicated than a moneyline bet. First off, there are 2 separate numbers to consider.
                Do you recall the plus and minus signs from moneyline bets? Well, spread
                bets almost always contain a negative number in between parentheses like this (-110). These are the odds in a spread bet. The same rule of thumb applies here.
                When you see a minus sign it's telling you
                that's how much you'd have to bet to win $100. So in this case we'd have to put up $110 to win $100.
                You will rarely see a plus sign in spread bets but it certainly happens.`
                }
              </p>
              <p>
                {
                  `The other set of numbers, not in parentheses, is where spread bets differ from moneyline bets. You will always see
                one team with a positivs number, and the other with a negative number. The simplest way to put it is
                that these numbers are handicaps. Think of it as either adding or subtracting that number from the teams
                final score. Would that team have more points after applying the sign and number?`
                }
              </p>
              <Row className="justify-content-center">
                <Col md={9} className="text-center mb-3">
                  <img src={oddsImage} />
                </Col>
              </Row>
              <p>
                {
                  `In the line above Dartmouth has a +10
                and Cornell has a -10. Take each team's final score and apply those numbers to it. What is the outcome?`
                }
              </p>
              <Row className="justify-content-center">
                <Col md={9} className="text-center mb-3">
                  <img src={finalScore} />
                </Col>
              </Row>
              <p>
                {
                  `Here's the final score from this game. Let's say we took the underdog, Dartmouth, +10. All we need to
                do to understand if we won the bet is apply that +10 to Dartmouth's final score.
                Well, 83 + 10 = 93 which is still less than the 95 points Cornell scored. So Dartmouth, even with an extra
                10 points added to their final score, still would've lost. If we had taken Cornell at -10 we
                would've won that bet since 95 - 10 = 85 which is greater than 83.`
                }
              </p>
              <p>
                {
                  `What happens in the case of a tie? If we were
                to apply the points given from the spread bet, and the outcome results in a tie you simply get your
                money back. This is sometimes called a 'push'.`
                }
              </p>
            </Row>
            <Row>
              <h1>Total Bets</h1>
              <br />
              <Row className="justify-content-center">
                <Col className="text-center mb-3" md={3}>
                  <img src={total} />
                </Col>
              </Row>
              <p>
                {
                  `Total bets are the last type of bet we'll look at.
                  With a total bet you'll be betting on the final score of a game, and whether or not it is over/under a certain number.`
                }
              </p>
              <p>
                {
                  `In our Dartmouth vs. Cornell game notice that the same number is on top and bottom of the line, but there's an 'O' and a 'U' next
                to each number. The 'O' stand for OVER and the 'U' stands for UNDER. Similarly to a point spread the actual odds will be between parentheses. In this
                case the odds are the same for the OVER and UNDER bet at (-110).`
                }
              </p>
              <p>
                {
                  `In this case the total was set at 155.5. It's very very common to see a one half increment so the final score doesn't land on the actual number.
                  To understand if you've won or lost the bet all you have to do is add up the final score
                  and see whether it's OVER or UNDER the total number. For example, if we had taken the OVER for Dartmouth vs. Cornell we would have won that bet since
                  83 + 95 = 178 which is greater than 155.5. If we had taken the under we would have lost that bet.`
                }
              </p>
              <p>
                {
                  `Total bets are fun if you don't want to take one side but think the game might be a high scoring affair, or maybe you think both defenses are solid and the offenses
                are unlikely to score a lot.`
                }
              </p>
            </Row>
            <br />
            <Row>
              <h1>FAQ</h1>
              <Accordion>
                <Accordion.Item eventKey="0" className="first-accordion-item">
                  <Accordion.Header>How do I place a bet?</Accordion.Header>
                  <Accordion.Body>
                    {
                      `In order to place a bet simply navigate to the home page or select a particular sport's odds page. From there you can pick one of three
                      kinds of bets (spread, moneyline (win), or total) and wager any amount you'd like up to your account balance.
                      `
                    }
                    <img className="mt-3" src={PlaceBetGIF} alt="place bet gif" />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    What if I run out of money?
                  </Accordion.Header>
                  <Accordion.Body>
                    {
                      `If you are running low on funds you can go to the 'My Bets' page and add more funds.
                      Keep in mind you can only make 1 deposit every 24 hours!
                      `
                    }
                    <br />
                    <img className="mt-3" src={depositFundsGIF} alt="deposit funds gift" />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>How do I know if I won or lost a bet?</Accordion.Header>
                  <Accordion.Body>
                    {
                      `You can see your bet history on the 'My Bets' page. A won bet will show as green and a lost bet will show as red.
                      All pending bets will remain white until the bet is registered as won or lost.
                      `
                    }
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>How long does it take to process a bet?</Accordion.Header>
                  <Accordion.Body>
                    {
                      `When a game starts the server will check for final scores 3 hours later, and if the game has not ended it will check for the final score of that
                      after another 30 minutes. That process will continue until the final score is found. There may be a lag between when
                      a game ends and you see the outcome posted.
                      `
                    }
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
          </Container>
        </div>
        <Footer className="footer" />
      </>
    );
  }
}

InfoPage.contextType = AppContext;
