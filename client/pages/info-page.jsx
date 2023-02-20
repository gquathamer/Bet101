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

export default class InfoPage extends React.Component {
  render() {
    return (
      <>
        <div className="container">
          <Navigation />
          <Container className="my-5" fluid="md">
            <Row>
              <h1>What is Bet101?</h1>
              <p>
                {
                  `This app is what Im calling Bet101 and is designed for folks interested in sports betting, but not interested enough to risk real money.
                Essentially, the app allows you to bet on real games using fake money. This page will go over the basics of sports betting and how to place your first bet.`
                }
              </p>
              <p>
                {
                  `Even if youre not that interested in sports betting Id love for you to navigate around the app and give me any feedback! Does it feel
                intuitive? If not, thats okay Id like to know anyways!`
                }
              </p>
            </Row>
            <br />
            <Row>
              <h1>How To Read Odds</h1>
              <p>
                {
                  `You might have navigated to the homepage or a particular sports page and saw some
                very strange numbers and symbols like so:`
                }
              </p>
              <Row className="justify-content-center">
                <Col md={6} className="text-center mb-3">
                  <img src={oddsImage} />
                </Col>
              </Row>
              <p>
                {
                  `So lets break this down one step at a time. From left to right we'll take a look at each section and understand what it means. The first 2 sections are
                probably obvious but these will indicate the date the game will be played, and the teams that will be playing:`
                }
              </p>
              <Row className="justify-content-center">
                <Col md={6} className="text-center mb-3">
                  <img src={firstTwo} />
                </Col>
              </Row>
              <p>
                The next 3 sections contain the odds for 3 different kinds of bets.
              </p>
              <Row>
                <ul className="info-page-list">
                  <li><i>Spread Bets</i></li>
                  <li><i>Moneyline Bets</i></li>
                  <li><i>Totals Bets</i></li>
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
                  `A moneyline bet is the simplest bet to wrap your head around. You are picking the winner of a game. The plus sign indicates an underdog and the minus sign
                indicates a favorite. Every moneyline bet will have a plus and a minus sign (an underdog and a favorite).`
                }
              </p>
              <p>
                {
                  `The numbers themselves indicate the potential winnings of you placing a bet on that team. Whether you place a bet on the underdog or on the favorite will have
                consquences for your potential winnings. For example, let's say you placed a $100 bet on Dartmouth. The payout for that bet would be $390. So you'd walk away
                with $490 ($390 + your original $100).`
                }
              </p>
              <p>
                {
                  `So what about the favorite? The favorite works a little bit differently. You can think of the negative number as how much you'd have to bet in order to win
                $100. So if you wanted to win $100 by placing a moneyline bet on Cornell you'd need to bet $550.`
                }
              </p>
              <p>
                {
                  `As you can see the payout for the underdog is quite lucrative while the payout for the favorite is marginal. This is by design. The sportsbooks that create
                these odds are trying to balance their books. We'll revisit this topic again but sportsbooks make their money when half of the bets are on either side of
                a line. So if 50% of the money is on Dartmouth to win and the other 50% is on Cornell to win that's a good day for the sportsbook. The underdog odds are
                designed to lure you in with high potential payouts, but the favorite is a favorite for good reason.`
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
                  `A spread bet is a little more complicated than a moneyline bet, but not that complicated.
                Do you recall the positive and negative numbers from moneyline bets? You will find that spread
                bets almost always contain a negative number in between parentheses like this (-110). This follows
                the exact same pattern as it does with moneyline bets. When you see a minus sign it's telling you
                that's how much you'd have to bet to win $100. So in this case we'd have to put up $110 to win $100.`
                }
              </p>
              <p>
                {
                  `The other set of numbers not in parentheses is where spread bets differ from moneyline bets. You will always see
                one team with a positive number, and the other with a negative number. The simplest way to put it is
                that these numbers are handicaps. Think of it as either adding or subtracting that number from the games
                final score. Would that team have more points after applying the sign and number?`
                }
              </p>
              <Row className="justify-content-center">
                <Col md={6} className="text-center mb-3">
                  <img src={oddsImage} />
                </Col>
              </Row>
              <p>
                {
                  `In the line above if we look at the spread column we can see that Dartmouth has a +10
                and Cornell has a -10. Again, take the final score of the game and apply those numbers to
                the final score. What is the outcome?`
                }
              </p>
              <Row className="justify-content-center">
                <Col md={6} className="text-center mb-3">
                  <img src={finalScore} />
                </Col>
              </Row>
              <p>
                {
                  `Here's the final score from this game. It's important to note we can only bet on
                one side of the line. So let's say we took the underdog, Dartmouth, +10. All we need to
                do to understand if we won the bet is apply that +10 to Dartmouth's final score. If we do that
                did they win? Well, 83 + 10 = 93 which is still less than 95. So Dartmouth, even with an extra
                10 points added to their final score still would've lost. If we had taken Cornell at -10 we
                would've won that bet 95 - 10 = 85 which is greater than 83.`
                }
              </p>
              <p>
                {
                  `What happens in the case of a tie? You'll hear the term 'push' used in cases like this. If we were
                to apply the points given from the spread bet, and the outcome results in a tie you simply get your
                money back.`
                }
              </p>
            </Row>
            <Row>
              <h1>Totals Bets</h1>
              <br />
              <Row className="justify-content-center">
                <Col className="text-center mb-3" md={3}>
                  <img src={total} />
                </Col>
              </Row>
              <p>
                {
                  `Totals are the last type of bet that we'll look at. I like totals bets when I'm not too keen on either team in a game, but still want to bet on the
                action. With a totals bet you'll be betting on the final score of a game, and whether or not it is over/under a certain number.`
                }
              </p>
              <p>
                {
                  `In our Dartmouth vs. Cornell game you'll notice that we're given the same number on the top and bottom of the line but there's an 'O' and a 'U' next
                to each number. The 'O' stand for OVER and the 'U' stands for UNDER. Similarly to a point spread the actual odds will be between parentheses. In this
                case the odds are the same for the OVER and UNDER bet at (-110). Again, you'd need to bet $110 to win $100.`
                }
              </p>
              <p>
                {
                  `In the case the total score was set at 155.5. It's very very common to see a one half increment so that the final scoree cannot land on the actual number
                given (which would result in a push and you getting your money back). To understand if you've won or lost the bet all you have to do is add up the final score
                and see whether it's OVER or UNDER the given final score. For example, if we had taken the OVER for Dartmouth vs. Cornell we would have won that bet since
                83 + 95 = 178 which is greater than 155.5. If we had taken the under we would have lost that bet.`
                }
              </p>
              <p>
                {
                  `Totals are fun if you don't want to take one side but think the game might be a high scoring affair, or maybe you think both defenses are solid and the offenses
                are unlikely to score a lot.`
                }
              </p>
            </Row>
            <br />
            <Row>
              <h1>FAQ</h1>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>How do I place a bet?</Accordion.Header>
                  <Accordion.Body>
                    {
                      'In order to place a bet simply navigate to the home page or select a particular sport\'s odds page.'
                    }
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    What if I run out of money?
                  </Accordion.Header>
                  <Accordion.Body>
                    Velit fugiat sunt pariatur pariatur anim in in. Commodo sunt sint laborum fugiat consectetur sit ex elit deserunt. Irure sit amet sint in commodo elit. Duis minim qui velit ullamco excepteur. Voluptate velit aliqua id ullamco qui. Nisi anim deserunt duis aliqua. Excepteur enim elit incididunt eu sit enim.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>How do I know if I won or lost a bet?</Accordion.Header>
                  <Accordion.Body>
                    Sint velit elit et ea sint nisi ad proident fugiat do do proident. Est magna dolore exercitation voluptate aliquip fugiat ipsum dolore elit proident magna minim. Anim esse magna anim deserunt culpa cupidatat cupidatat. Anim veniam ullamco nulla culpa occaecat sit tempor ea. Cupidatat id minim do incididunt non aliqua aute magna et aliqua velit dolor deserunt nostrud.
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
