var expect = require('chai').expect;
var login = require('../lib/login');
var loginInfo = require('../lib/loginInfo');
var companyInfo = require('../lib/companyInfo');
var agent;

describe('companyInfo', function () {

  before(function (done) {
    this.timeout(30000);
    login.login("rknell@snappyapps.com.au", "ry1an234")
      .then(function (_agent) {
        agent = _agent;
        return loginInfo.organisationSearch(agent, "Demo Company")
      })
      .then(function (searchResult) {
        return loginInfo.organisationSelect(agent, searchResult[0].organisationUrl);
      })
      .then(function () {
        done();
      })
      .catch(done);
  });

  var unreconciledAccountUrls;
  it('should get unreconciled bank accounts', function (done) {
    this.timeout(10000);
    companyInfo.unreconciledAccounts(agent)
      .then(function (result) {
        expect(result[0].url).to.exist;
        expect(result[0].name).to.exist;
        expect(result[0].bankAcctId).to.exist;
        unreconciledAccountUrls = result;
        done()
      })
      .catch(done)
  });

  it('should get get unreconciled lines', function (done) {
    this.timeout(26000);
    companyInfo.unreconciledTransactions(agent, unreconciledAccountUrls[0].url)
      .then(function (result) {
        expect(result.bankAccount).to.exist;
        done()
      })
      .catch(done)
  });

  it('should get the chart of accounts', function(done){
    companyInfo.chartOfAccounts(agent)
      .then(function(result){
        expect(result.length).to.be.above(10);
        expect(result[0].code).to.exist;
        expect(result[0].name).to.exist;
        expect(result[0].id).to.exist;
        done()
      })
      .catch(done);
  });

});
