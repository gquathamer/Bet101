# Bet101

A full stack JavaScript application for sports betting beginners. Bet101 allows you to bet on real games using fake money.

## Why I built this

I love sports, and I've always been interested in the idea of betting on sporting events. However, I never really enjoyed the idea of losing my own money. I looked around for an
easy to use, and beginner friendly, app that would allow users to try betting in a risk free way. I didn't find anything. So I built Bet101 for people who want to try betting on real games without the risk of losing real money.

## Live Demo

Try the application live at [https://bet101.garrettquathamer.dev/](https://bet101.garrettquathamer.dev/)

## Technologies Used

- PostgreSQL
- Express
- React.js
- Node.js

### Tools and additional technologies

- [The Odds API](https://the-odds-api.com/)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [argon2](https://www.npmjs.com/package/argon2)
- AWS EC2
- [Dokku](https://dokku.com/)
- HTML5
- CSS3

## Features

- Users can place a bet on a real game using real odds
- Users can filter games/odds by sport
- Users can deposit more "funds"
- Users can see their bet history including winnings, losses, and deposits

## Preview

![demo-gif](gifs/app-demo.gif)

### Getting Started

1. Open up VSCODE and a new terminal window, and select 'Git Bash' from the launch profile dropwdown

    ![VSCode Terminal](gifs/vscodeterminal.gif)

1. Navigate to a directory where the repository will be stored and clone the repository.

    ```shell
    git clone https://github.com/gquathamer/G-Maps.git
    ```

1. From here you can navigate into the G-Maps directory and open the directory in a new VSCODE window using the following command

    ```shell
    code .
    ```

    ![VSCODE Repo](gifs/vscoderepo.gif)

1. Ensure in the new VSCODE window you've navigated to the G-Maps directory and install all dependencies with NPM.

    ```shell
    npm install
    ```
    ![VSCODE Terminal](gifs/vscodenpm.gif)

1. If you don't already have the Live Server extension add that and right click on index.html and select 'Open with Live Server'

      ![LiveReload Server](gifs/launch.gif)
