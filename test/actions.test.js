var expect = require('chai').expect;
var actions = require('../lib/actions');
var companyInfo = require('../lib/companyInfo');
var login = require('../lib/login');
var loginInfo = require('../lib/loginInfo');

var agent, organisations, referenceData, unrecLines;

describe('actions', function () {

  before(function (done) {
    this.timeout(30000);
    login.login("rknell@snappyapps.com.au", "ry1an234")
      .then(function (_agent) {
        agent = _agent;
        return loginInfo.getOrganisations(agent)
      })
      .then(function (_organisations) {
        organisations = _organisations;
        return loginInfo.getReferenceData(agent, organisations.demo.id);
      })
      .then(function (_referenceData) {
        referenceData = _referenceData;
        return companyInfo.getUnreconciledLines(agent, organisations.demo.id, referenceData.dashboardSummary.bankAccounts[0].id)
      })
      .then(function (_unrecLines) {
        unrecLines = _unrecLines;
        done();
      })
      .catch(done);
  });

  it('should reconcile a transaction', function (done) {
    var data = {
      bankAccountID: unrecLines.results[0].bankAccountID,
      statementLineId: unrecLines.results[0].id,
      paidToID: referenceData.contacts[0].id,
      paidToName: referenceData.contacts[0].name,
      accountID: referenceData.accounts[0].id,
      gstCode: referenceData.accounts[0].gstCode,
      description: "Test reconciliation",
      trackingItemID1: "",
      trackingItemID2: "",
      trackingItemID3: "",
      trackingItemID4: "",
      comments: "Test Note"
    }

    console.log(data);
    actions.reconcileTransaction(agent, organisations.demo.id, data)
      .then(function(result){
        console.log(result);
        done();
      })
      .catch(done);
  })

  it('should add a note to a transaction', function (done) {
    actions.addNote(agent, organisations.demo.id, unrecLines.results[1].id, "Added Note")
      .then(function(result){
        console.log(result);
        done();
      })
      .catch(done);
  })

});