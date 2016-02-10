var expect = require('chai').expect;
var login = require('../lib/login');
var loginInfo = require('../lib/loginInfo');

var agent, organisations;

describe('loginInfo', function () {

  before(function (done) {
    login.login("rknell@snappyapps.com.au", "ry1an234")
      .then(function (_agent) {
        agent = _agent;
        done()
      })
      .catch(done);
  });

  it('should get a list of all organisations', function(done){
    loginInfo.getOrganisations(agent)
      .then(function(result){
        organisations = result;
        console.log(result);
        done();
      })
      .catch(done);
  });

  it('should get reference data', function(done){
    this.timeout(4000);
    loginInfo.getReferenceData(agent, organisations.demo.id)
      .then(function(result){
        expect(result.accounts).to.exist;
        expect(result.contacts).to.exist;
        expect(result.dashboardSummary).to.exist;
        expect(result.taxCodes).to.exist;
        done();
      })
      .catch(done);
  })

});