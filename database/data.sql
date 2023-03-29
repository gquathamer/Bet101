insert into "users" ("userId", "userName", "hashedPassword", "accountBalance")
values (1, 'testuser', '$argon2id$v=19$m=4096,t=3,p=1$y/qZyhrKL066Zk6hNxENmw$HQpwifhJvjlyKaUk5zurjqfX0jHYfF4mzAmv46Q/dmI', 850.00);

insert into "deposits" ("depositId", "depositAmount", "userId", "createdAt")
values (1, 1000, 1, '2023-03-26T18:00:00Z');

insert into "bets" ("betId", "gameId", "gameStart", "createdAt", "sportType", "betType", "betAmount", "winningTeam", "homeTeam", "awayTeam", "homeTeamScore", "awayTeamScore", "price", "points", "potentialWinnings", "status", "userId")
values (100001, '6f0a3a8ecaee2e8e25a500f99374310d', '2023-03-26T18:21:40Z', '2023-03-26T18:00:40Z', 'basketball_ncaab', 'moneyline', 100, 'San Diego St Aztecs', 'San Diego St Aztecs', 'Creighton Bluejays', 57, 56, 150, NULL, 150, 'won', 1),
(100002, '4a5603e01a90be27dd80c948fc9472c3', '2023-03-26T21:11:13Z', '2023-03-26T21:00:13Z', 'basketball_ncaab', 'spread', 100, 'Texas Longhorns', 'Texas Longhorns', 'Miami Hurricanes', 81, 88, -110, -2.5, 90.91, 'lost', 1),
(100003, 'e04b76903914957dc0aaf6920dc05eea', '2023-03-27T00:40:41Z', '2023-03-27T00:00:41Z', 'basketball_nba', 'total', 100, 'Over', 'Golden State Warriors', 'Minnesota Timberwolves', 96, 99, -110, 190.5, 90.91, 'lost', 1)
