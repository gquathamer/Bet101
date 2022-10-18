function checkPassword(password) {
  if (password.length < 6) {
    return ('password too_short');
  } else if (password.length > 50) {
    return ('password too_long');
  } else if (password.search(/\d/) === -1) {
    return ('password does not contain at least one number');
  } else if (password.search(/[a-zA-Z]/) === -1) {
    return ('password does not contact at least one letter');
  } else if (password.search(/[^a-zA-Z0-9!@#$%^&*()_+.,;:]/) !== -1) {
    return ('password contains a bad character');
  }
  return true;
}

module.exports = checkPassword;
