var request = require('request');
var q = require('q');
var console = require('tracer').colorConsole();
var cheerio = require('cheerio');

function xeroRequest(url, agent) {
  var deferred = q.defer();

  agent.get(url, function (err, res, body) {
    redirectLoop(err, res, body, agent)
      .then(deferred.resolve)
      .catch(function (err) {
        console.log("RequestError", url, body, err);
        deferred.reject(err);
      });
  });

  return deferred.promise;
}

function post(agent, url, data, headers) {
  var deferred = q.defer();

  agent({
    url: url,
    method: "POST",
    body: JSON.stringify(data),
    headers: headers
  }, function (err, res, body) {
    if(err){
      deferred.reject(err);
    } else if(res.statusCode !== 200){
      deferred.reject(res);
    } else {
      deferred.resolve(body);
    }
  });

  return deferred.promise;
}

function redirectLoop(err, response, body, agent) {
  var deferred = q.defer();

  if (response) {
    if (response.statusCode === 302) {
      agent.get(response.request.uri.href, function (err, response, body) {
        if (response.statusCode === 302) {
          redirectLoop(err, response, body, agent)
            .then(deferred.resolve)
            .catch(deferred.reject);
        } else {

          handleRedirectForm(response, agent)
            .then(deferred.resolve)
            .catch(deferred.reject);

        }
      })
    } else {
      if(response.request.uri.href.indexOf("https://login.xero.com/") > -1){
        //Logged out.
        deferred.reject({loggedOut: true, message: "Unable to login. Either xero password has changed or account has logged out. Please try again and confirm your password in the admin portal."});
      } else {
        handleRedirectForm(response, agent)
          .then(deferred.resolve)
          .catch(deferred.reject);
      }
    }
  } else {
    deferred.reject({"message": "redirect loop failed"});
  }

  return deferred.promise;
}

function handleRedirectForm(response, agent) {
  var deferred = q.defer();

  var $ = cheerio.load(response.body);

  if ($('title').text() === "Working...") {
    var form = {};
    $('input').each(function (index, element) {
      var name = $(this).attr('name');
      var value = $(this).attr('value');

      form[name] = value;
    });

    var actionUrl = $('form').attr('action');

    agent.post(actionUrl, {form: form}, function (err, response, body) {
      if (response.statusCode === 302) {
        redirectLoop(err, response, body, agent)
          .then(deferred.resolve)
          .catch(deferred.reject);
      } else {
        deferred.resolve(body);
      }
    })
  } else {
    deferred.resolve(response.body);
  }
  return deferred.promise;
}

function getAgent() {
  var cookies = request.jar();
  return request.defaults({jar: cookies});
}

module.exports = {
  xeroRequest: xeroRequest,
  getAgent: getAgent,
  post: post
};