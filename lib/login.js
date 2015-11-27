var xeroRequest = require('./request');
var q = require('q');

function login(username, password) {
  var deferred = q.defer();
  agent = xeroRequest.getAgent();
  agent.post("https://login.xero.com/signin", {
    form: {
      userName: username,
      password: password
    }
  }, function (error, response, body) {

    var loginFailed = body.indexOf("Login | Xero Accounting Software");

    if (loginFailed >= 0) {
      deferred.reject({message: "Invalid Xero Credentials", type: "authfailed"});
    } else {
      deferred.resolve(agent);
    }

  });

  return deferred.promise;
}

module.exports = {
  login: login
};