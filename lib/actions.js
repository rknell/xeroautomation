function reconcileTransaction(agent, organisationId, data) {

  //var exampleData = {
  //  bankAccountID: "13918178-849A-4823-9A31-57B7EAC713D7",
  //  statementLineId: "1103B2DA-BC0E-45B0-B620-B86598F8D603",
  //  paidToID: "",
  //  paidToName: "Central City Parking",
  //  accountID: "EE30A086-D381-4BD6-BA47-7AF927D25825",
  //  gstCode: "GST/INPUT",
  //  description: "gettin shit done",
  //  trackingItemID1: "",
  //  trackingItemID2: "",
  //  trackingItemID3: "",
  //  trackingItemID4: "",
  //  comments: "Hey its a note"
  //}

  return agent({
    uri: "https://touch-cell.legacy.xero.com/apiv2/bank/SaveFastPayment",
    method: "POST",
    headers: {
      "X-Xero-Version": "XT 3.5.2(121) Android",
      "X-Xero-DeviceToken": agent.xeroCredentials.deviceToken,
      "X-Xero-SessionID": agent.xeroCredentials.sessionID,
      "X-Xero-OrganisationID": organisationId
    },
    form: data,
    json: true
  })

}

function addNote(agent, organisationId, statementLineId, note) {

  return agent({
    uri: "https://touch-cell.legacy.xero.com/apiv2/bank/SaveBankRecComment",
    method: "POST",
    headers: {
      "X-Xero-Version": "XT 3.5.2(121) Android",
      "X-Xero-DeviceToken": agent.xeroCredentials.deviceToken,
      "X-Xero-SessionID": agent.xeroCredentials.sessionID,
      "X-Xero-OrganisationID": organisationId
    },
    form: {
      statementLineId: statementLineId,
      comments: note
    },
    json: true
  })

}

module.exports = {
  reconcileTransaction: reconcileTransaction,
  addNote: addNote
};