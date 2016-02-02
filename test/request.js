var expect = require('chai').expect;
var request = require('../lib/request');


describe.only('request', function () {

  it('should fail to login, and handle it with a rejection', function (done) {
    this.timeout(10000);
    request.xeroRequest("https://go.xero.com/ajax/contacts/find", request.getAgent())
      .then(function(result){
        done("should have rejected")
      })
      .catch(function(err){
        expect(err.loggedOut).to.equal(true);
        done();
      })
  });

});