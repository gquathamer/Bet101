function checkDeposit(deposit) {
  if (parseInt(deposit) <= 0 || isNaN(parseInt(deposit))) {
    return 'Deposit must be a positive integer';
  } else if (!Number.isInteger(deposit)) {
    return 'Deposit must be a positive integer';
  } else if (deposit > 10000) {
    return 'Deposit must be less than $10,000';
  }
  return true;
}

module.exports = checkDeposit;
