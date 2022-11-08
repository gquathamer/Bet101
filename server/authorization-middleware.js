const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

function authorizationMiddleware(req, res, next) {
  /* your code here */
  /**
   * Try to get the 'X-Access-Token' from the request headers.
   * If no token is provided,
   *   throw a 401 error with the message 'authentication required'
   * Use jwt.verify() to verify the authenticity of the token and extract its payload
   * Assign the extracted payload to the user property of the req object.
   * Call next() (with no arguments) to let Express know to advance to its next route or middleware.
   */

  /**
    * References:
    * https://expressjs.com/en/4x/api.html#req.get
    * https://nodejs.org/api/http.html#http_message_headers
    * https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    */
  const accessToken = req.get('x-access-token');
  if (!accessToken) {
    throw new ClientError(401, 'authentication required');
  }
  req.user = jwt.verify(accessToken, process.env.TOKEN_SECRET);
  next();
}

module.exports = authorizationMiddleware;
