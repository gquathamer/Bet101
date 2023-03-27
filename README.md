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

1. Install the Dev Containers extension published by Microsoft

    ![Dev Containers Extension](gifs/devcontainers.png)

1. In the bottom left corner of VSCODE click the light blue bar and select 'clone repository in a container volume' from the command palette

    ![Clone Repo]()

1. Create a .env file from the given .env.example

      ```shell
      cp .env.example .env
      ```

1. Within the .env file change the following:

      1. ```javascript
          TOKEN_SECRET='a random string of alphanumberic characters';
          DATABASE_URL=postgres://dev:dev@localhost/{anything}?sslmode=disable;
          API_KEY='your odds-api key';
        ```

1. Start postgreSQL

      ```shell
      sudo service postgresql start
      ```

1. Create a new database

      ```shell
      createdb nameOfDatabase
      ```

1. Open pgweb to ensure the database was created successfully

      ```
      pgweb --db=nameOfDatabase
      ```

      ![pgweb gif]()

1. Start developing by running the dev script which will launch the app on localhost:3000 (unless changed in .env)

      ```shell
      npm run dev
      ```
