const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

function authorizationMiddleware(req, res, next) {
  const accessToken = req.get('x-access-token');
  if (!accessToken) {
    throw new ClientError(401, 'authentication required');
  }
  req.user = jwt.verify(accessToken, process.env.TOKEN_SECRET);
  next();
}

module.exports = authorizationMiddleware;
