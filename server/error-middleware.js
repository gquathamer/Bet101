const ClientError = require('./client-error');

function errorMiddleware(err, req, res, next) {
  if (err instanceof ClientError) {
    res.status(err.status).json({
      error: err.message
    });
  } else if (err.message === 'duplicate key value violates unique constraint "users_userName_key"') {
    console.error(err);
    res.status(409).json({
      error: 'that username already exists!'
    });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
}

module.exports = errorMiddleware;
