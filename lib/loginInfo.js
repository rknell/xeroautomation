var q = require('q');
var xeroRequest = require('./request');

function organisationSearch(agent, query) {

  var deferred = q.defer();

  var url = "https://login.xero.com/myxero/organisation?query=" + query
  agent.get(url, function (err, response, body) {
    if (err) {
      deferred.reject(err);
    } else {
      if (body) {
        if (JSON.parse(body).organisations) {
          deferred.resolve(JSON.parse(body).organisations);
        } else {
          deferred.reject({status: 404, message: "No results found"})
        }
      } else {
        deferred.reject("Invalid response");
      }
    }
  });

  return deferred.promise;

}

function organisationSelect(agent, organisationUrl){
  return xeroRequest.xeroRequest(organisationUrl, agent)
}

module.exports = {
  organisationSearch: organisationSearch,
  organisationSelect: organisationSelect
};