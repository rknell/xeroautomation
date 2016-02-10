var expect = require('chai').expect;
var login = require('../lib/login');

var agent;

describe('login', function () {

  it('should login', function (done) {
    login.login("rknell@snappyapps.com.au", "ry1an234")
      .then(function (_agent) {
        agent = _agent;

        console.log(agent.xeroCredentials);
        expect(agent).to.exist;
        done();
      })
      .catch(done)
  });

  it('should fail to login', function (done) {
    login.login("rknell@snappyapps.com.au", "ry1an234345")
      .then(function (_agent) {
        done("Should have failed");
      })
      .catch(function(){
        done();
      })
  });

});