function getOrganisations(agent) {
  return agent({
    uri: "https://touch.xero.com/apiv2/MyXero/getOrganisations?start=1&limit=50",
    method: "GET",
    headers: {
      "X-Xero-Version": "XT 3.5.2(121) Android",
      "X-Xero-DeviceToken": agent.xeroCredentials.deviceToken,
      "X-Xero-SessionID": agent.xeroCredentials.sessionID
    },
    json: true
  })
}

function getReferenceData(agent, organisationId) {
  return agent({
    uri: "https://touch-cell.legacy.xero.com/apiv2/Dashboard/getCutDownReferenceData?includeDashboard=true",
    method: "GET",
    headers: {
      "X-Xero-Version": "XT 3.5.2(121) Android",
      "X-Xero-DeviceToken": agent.xeroCredentials.deviceToken,
      "X-Xero-SessionID": agent.xeroCredentials.sessionID,
      "X-Xero-OrganisationID": organisationId
    },
    json: true
  })
}

module.exports = {
  getOrganisations: getOrganisations,
  getReferenceData: getReferenceData
};