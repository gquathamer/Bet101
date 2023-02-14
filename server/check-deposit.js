function checkDeposit(depositAmount) {
  if (isNaN(depositAmount)) {
    return 'Deposit amount must be a valid number';
  }
  depositAmount = parseFloat(depositAmount);
  if (depositAmount < 1) {
    return 'Deposit amount must be at least $1';
  }
  if (depositAmount > 10000) {
    return 'Deposit amount must be less than $10,000';
  }
  return true;
}

module.exports = checkDeposit;
