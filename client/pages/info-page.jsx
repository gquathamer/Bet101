import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Navigation from '../components/navbar';
import oddsImage from '../images/odds.png';

export default class InfoPage extends React.Component {
  render() {
    return (
      <>
        <Navigation />
        <Container className="mt-5" fluid="md">
          <Row>
            <h1>What the heck is this?</h1>
            <p>
              This app is what Im calling Bet101 and is designed for folks interested in sports betting, but not interested enough to risk real money.
              The app allows you to bet on real games using fake money. This page will go over the basics of sports betting and how to place your first bet.
            </p>
            <p>
              Even if youre not that interested in sports betting Id love for you to navigate around the app and give me any feedback! Does it feel
              intuitive? If not, thats okay Id like to know anyways!
            </p>
          </Row>
          <Row>
            <h1>How To Read Odds</h1>
            <p>
              Alright, so first things first. How the heck do I read odds? You might have navigated to the homepage or a particular sports page and saw some
              very strange numbers and symbols like so:
            </p>
            <img src={oddsImage} />
          </Row>
          <Row>
            <h1>Moneyline Bets</h1>
            <p>
              Ea occaecat dolor mollit laboris qui ullamco sit officia et sunt. Eiusmod minim eu fugiat sint officia minim ea qui qui veniam. Ex nisi pariatur officia ad voluptate est.
              Lorem deserunt et cillum dolore eu. Ex exercitation minim labore proident. Occaecat id Lorem nisi veniam non nostrud elit ut pariatur excepteur cillum sint fugiat tempor.
            </p>
          </Row>
          <Row>
            <h1>Spread Bets</h1>
            <p>
              Cupidatat consequat Lorem mollit ad ad ex. Anim elit id ea Lorem officia id qui adipisicing sunt ad occaecat exercitation Lorem.
              Elit ullamco aliquip qui duis ea Lorem.
            </p>
          </Row>
          <Row>
            <h1>Totals Bets</h1>
            <p>
              Commodo quis consequat Lorem aliqua cillum et aliquip voluptate consectetur labore magna reprehenderit. Incididunt duis minim et id id eiusmod.
              Velit cupidatat cupidatat commodo et id anim quis consequat adipisicing.
            </p>
          </Row>
          <Row>
            <h1>FAQ</h1>
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>How do I place a bet?</Accordion.Header>
                <Accordion.Body>
                  Magna ullamco enim magna nisi ex commodo ullamco sit eiusmod ex velit. Adipisicing ea ex ipsum deserunt consectetur commodo. Est laborum veniam culpa reprehenderit cupidatat nostrud anim reprehenderit irure fugiat. Commodo ad aliquip sit labore nostrud dolor ex mollit ullamco ex sunt dolore consectetur adipisicing.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>
                  What if I run out of money?
                </Accordion.Header>
                <Accordion.Body>
                  Velit fugiat sunt pariatur pariatur anim in in. Commodo sunt sint laborum fugiat consectetur sit ex elit deserunt. Irure sit amet sint in commodo elit. Duis minim qui velit ullamco excepteur. Voluptate velit aliqua id ullamco qui. Nisi anim deserunt duis aliqua. Excepteur enim elit incididunt eu sit enim.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>How do I know if I won or lost a bet?</Accordion.Header>
                <Accordion.Body>
                  Sint velit elit et ea sint nisi ad proident fugiat do do proident. Est magna dolore exercitation voluptate aliquip fugiat ipsum dolore elit proident magna minim. Anim esse magna anim deserunt culpa cupidatat cupidatat. Anim veniam ullamco nulla culpa occaecat sit tempor ea. Cupidatat id minim do incididunt non aliqua aute magna et aliqua velit dolor deserunt nostrud.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>
        </Container>
      </>
    );
  }
}
