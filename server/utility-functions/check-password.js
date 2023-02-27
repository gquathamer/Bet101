function checkPassword(password) {
  if (password.length < 8) {
    return ('password length must be 8 or more letters, numbers, or characters');
  } else if (password.length > 50) {
    return ('password cannot contain more than 50 letters, numbers, or characters');
  } else if (password.search(/\d/) === -1) {
    return ('password does not contain at least one number');
  } else if (password.search(/[a-zA-Z]/) === -1) {
    return ('password does not contain at least one letter');
  } else if (password.search(/[^a-zA-Z0-9!@#$%^&*()_+.,;:]/) !== -1) {
    return ('password contains a bad character');
  }
  return true;
}

module.exports = checkPassword;
