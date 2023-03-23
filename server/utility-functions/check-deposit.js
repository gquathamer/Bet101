function checkDeposit(depositAmount, accountBalance) {
  if (!depositAmount) {
    return 'Deposit amount amount is required';
  }
  if (isNaN(+depositAmount)) {
    return 'Deposit amount must be a valid number';
  }
  if (typeof desositAmount === 'string' && depositAmount.trim() === '') {
    return 'Deposit amount must be a valid number between 1 and 10,000';
  }
  depositAmount = parseFloat(depositAmount);
  accountBalance = parseFloat(accountBalance);
  if (depositAmount < 1) {
    return 'Deposit amount must be at least $1';
  }
  if (depositAmount > 10000) {
    return 'Deposit amount must be less than $10,000';
  }
  if (depositAmount + accountBalance > 10000) {
    return 'Account balance cannot exceed $10,000';
  }
  return true;
}

module.exports = checkDeposit;
