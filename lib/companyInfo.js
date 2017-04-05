var agent = require('request-promise');

function getUnreconciledLines(credentials, organisationId, bankAcctId) {
  return agent({
    uri: "https://touch-cell.legacy.xero.com/apiv2/bank/GetUnreconciledStatementLines?start=0&limit=500&id=" + bankAcctId,
    method: "GET",
    headers: {
      "X-Xero-Version": "XT 3.5.2(121) Android",
      "X-Xero-DeviceToken": credentials.xeroCredentials.deviceToken,
      "X-Xero-SessionID": credentials.xeroCredentials.sessionID,
      "X-Xero-OrganisationID": organisationId
    },
    json: true
  })
}

module.exports = {
  getUnreconciledLines: getUnreconciledLines
};