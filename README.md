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

## Getting Started

### Requirements

    1. Ensure you have Docker installed and running
    2. Install the 'Dev Containers' extension published by Microsoft

1. Open VSCODE and click the Dev Container shortcut in the bottom left

1. Select 'clone repository in container volume' and paste the below

    ```shell
      git clone git@github.com:gquathamer/Bet101.git
    ```

    ![VSCode Terminal](gifs/clone.gif)

1. Create a .env file from the given .env.example

      ```shell
        cp .env.example .env
      ```

1. Within the .env file change the following:

      ```javascript
        TOKEN_SECRET='a random string of alphanumberic characters';
        DATABASE_URL=postgres://dev:dev@localhost/{anything}?sslmode=disable;
        API_KEY='your odds-api key';
      ```

1. Make sure that the postgresql service is running.

      ```shell
        sudo service postgresql start
      ```

1. Create the database in the PostgreSQL database server. Use whatever database name you picked above.

      ```shell
        createdb nameOfDatabase
      ```


1. Start pgweb to confirm that your database was created.

      ```shell
        pgweb --db=nameOfDatabase
      ```

1. Execute the dev script and navigate to localhost:3000 (unless changed in .env)

      ```shell
        npm run dev
      ```
