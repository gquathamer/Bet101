export default function fetchAccountBalance(token) {
  fetch('/api/account-balance', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'x-access-token': token
    }
  })
    .then(response => response.json())
    .then(response => { return parseFloat(response.accountBalance); })
    .catch(err => console.error(err));
}
