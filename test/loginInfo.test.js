var expect = require('chai').expect;
var login = require('../lib/login');
var loginInfo = require('../lib/loginInfo');

var agent, companySearchResult

describe('loginInfo', function () {

  before(function (done) {
    login.login("rknell@snappyapps.com.au", "ry1an234")
      .then(function (_agent) {
        agent = _agent;
        done()
      })
      .catch(done);
  });

  it('should should find a company', function (done) {
    loginInfo.organisationSearch(agent, "Demo Company")
      .then(function (result) {
        console.log(result);
        companySearchResult = result;
        expect(result[0].name).to.exist;
        done();
      })
      .catch(done)
  });

  it('should select a company', function (done) {
    this.timeout(15000);
    loginInfo.organisationSelect(agent, companySearchResult[0].organisationUrl)
      .then(function(result){
        done()
      })
      .catch(done);
  });

});