var agent = require('request-promise');

function getOrganisations(credentials) {
  return agent({
    uri: "https://touch.xero.com/apiv2/MyXero/getOrganisations?start=1&limit=50",
    method: "GET",
    headers: {
      "X-Xero-Version": "XT 3.5.2(121) Android",
      "X-Xero-DeviceToken": credentials.xeroCredentials.deviceToken,
      "X-Xero-SessionID": credentials.xeroCredentials.sessionID
    },
    json: true
  })
}

function getReferenceData(credentials, organisationId) {
  return agent({
    uri: "https://touch-cell.legacy.xero.com/apiv2/Dashboard/getCutDownReferenceData?includeDashboard=true",
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
  getOrganisations: getOrganisations,
  getReferenceData: getReferenceData
};