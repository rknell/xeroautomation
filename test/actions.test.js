var expect = require('chai').expect;
var actions = require('../lib/actions');
var companyInfo = require('../lib/companyInfo');
var login = require('../lib/login');
var loginInfo = require('../lib/loginInfo');
var q = require('q');

var agent, unreconciledLines, unreconciledAccounts, contacts, accounts;

describe('actions', function () {

  before(function (done) {
    this.timeout(90000);
    login.login("rknell@snappyapps.com.au", "ry1an234")
      .then(function (_agent) {
        console.log("Logged In");
        agent = _agent;
        return loginInfo.organisationSearch(agent, "Demo Company")
      })
      .then(function (searchResult) {
        console.log("Got organisations");
        return loginInfo.organisationSelect(agent, searchResult[0].organisationUrl);
      })
      .then(function(){
        console.log("Selected Organisation");
        return q.all([
          companyInfo.unreconciledAccounts(agent),
          companyInfo.allContacts(agent),
          companyInfo.chartOfAccounts(agent)
        ])
      })
      .then(function(data){
        unreconciledAccounts = data[0];
        contacts = data[1];
        accounts = data[2];
        return companyInfo.unreconciledTransactions(agent,unreconciledAccounts[0]);

      })
      .then(function(_unreconciledLines){
        unreconciledLines = _unreconciledLines;

        done();
      })
      .catch(done);
  });

  it('should reconcile a transaction', function (done) {
    console.log("Reconciling", unreconciledLines.StatementLine[0]);
    actions.reconcileTransaction(agent,unreconciledAccounts[0].bankAcctId, unreconciledLines.StatementLine[0].StatementLineID,contacts[0].ContactID,contacts[0].Name,accounts[2].id,"GST/INPUT","working")
      .then(function(result){
        console.log(result);
        done();
      })
      .catch(done);
  })

});