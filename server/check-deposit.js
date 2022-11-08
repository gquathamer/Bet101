function checkDeposit(deposit) {
  if (parseInt(deposit) <= 0 || isNaN(parseInt(deposit))) {
    return 'deposit must be a positive integer';
  } else if (!Number.isInteger(deposit)) {
    return 'deposit must be a positive integer';
  } else if (deposit > 10000) {
    return 'deposit must be less than $10,000';
  }
  return true;
}

module.exports = checkDeposit;
