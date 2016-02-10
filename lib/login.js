var q = require('q');
var agent = require('request-promise');

function getAgent() {
  var cookies = request.jar();
  return request.defaults({jar: cookies});
}

function login(username, password) {
  var deferred = q.defer();

  agent({
    uri: "https://touch.xero.com/apiv2/loginDevice",
    json: true,
    form: {
      userName: username,
      password: password
    },
    method: "POST"
  })
    .then(function (result) {
      if (!result.success) {
        deferred.reject(result);
      } else {
        agent.xeroCredentials = result.user;
        deferred.resolve(agent);
      }
    })
    .catch(deferred.reject);

  return deferred.promise;
}

module.exports = {
  login: login
};