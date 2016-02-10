var expect = require('chai').expect;
var login = require('../lib/login');
var loginInfo = require('../lib/loginInfo');
var companyInfo = require('../lib/companyInfo');

var agent, organisations, referenceData;

describe('companyInfo', function () {

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
        done();
      })
      .catch(done);
  });

  it('should get unreconciled bank lines', function (done) {
     companyInfo.getUnreconciledLines(agent, organisations.demo.id, referenceData.dashboardSummary.bankAccounts[0].id)
       .then(function(result){
         console.log(result);
         done();
       })
       .catch(done);
  })

});
