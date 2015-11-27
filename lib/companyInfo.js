var xeroRequest = require('./request');
var cheerio = require('cheerio');
var q = require('q');

function unreconciledTransactions(agent, bankRecUrl, statementLines) {

  var deferred = q.defer();

  xeroRequest.xeroRequest(bankRecUrl, agent)
    .then(function (result) {

      var preLine = "_StatementLinesData =";
      var statementLinesStart = result.indexOf(preLine);
      var statementLinesEnd = result.substr(statementLinesStart + preLine.length).indexOf(";");

      if (!statementLines) {
        statementLines = JSON.parse(result.substr(statementLinesStart + preLine.length, statementLinesEnd));
      } else if (statementLinesStart !== -1) {
        var statementLinesString = result.substr(statementLinesStart + preLine.length, statementLinesEnd);
        var lines = JSON.parse(statementLinesString).StatementLine;
        for (var i = 0; i < lines.length; i++) {
          statementLines.StatementLine.push(lines[i]);
        }

      }

      $ = cheerio.load(result);

      var nextPageUrl = $("#mainPagerNext a").attr('href');
      //statementLines.bankAccount = bankRecUrl.name;

      if (nextPageUrl) {
        bankRecUrl = "https://go.xero.com/Bank/" + nextPageUrl;
        unreconciledTransactions(agent, bankRecUrl, statementLines)
          .then(deferred.resolve)
          .catch(deferred.reject);
      } else {
        deferred.resolve(statementLines);
      }

    })
    .catch(deferred.reject);

  return deferred.promise;

}

function unreconciledAccounts(agent) {
  //go to xero bank account
  var deferred = q.defer();

  xeroRequest.xeroRequest("https://go.xero.com/Bank/BankAccounts.aspx", agent)
    .then(function (result) {
      var $ = cheerio.load(result);

      var output = [];
      var data = $('.dashboard-box-inner').each(function (index, element) {

        var relativeUrl = $(this).find('.xbtn.blue').attr('href');

        if (relativeUrl) {
          var url = "https://go.xero.com" + relativeUrl
          var bankAccountId = url.split("?")[1].substr(10);

          output.push({
            url: url,
            name: $(this).find('.bank-name').text(),
            bankAcctId: bankAccountId
          });
        }

      });

      deferred.resolve(output);
    })
    .catch(deferred.reject);

  return deferred.promise;
}

function allContacts(agent) {
  return xeroRequest.xeroRequest("https://go.xero.com/ajax/contacts/find", agent)
    .then(function(result){
      return q(JSON.parse(result));
    })
}

function chartOfAccounts(agent) {
  return xeroRequest.xeroRequest("https://go.xero.com//GeneralLedger/ChartOfAccounts.aspx", agent)
    .then(function (result) {
      var $ = cheerio.load(result);

      var accounts = [];
      $('#chartOfAccounts tr').each(function(){
        var account = {
          id: $(this).attr('id'),
          code: $(this).find('td').eq(1).text().trim(),
          name: $(this).find('td').eq(2).find("a").text().trim(),
          type: $(this).find('td').eq(3).text().trim(),
          tax: $(this).find('td').eq(4).text().trim()
        };
        if(account.id){
          accounts.push(account);
        }
      });

      return q(accounts);
    })
}

module.exports = {
  allContacts: allContacts,
  unreconciledAccounts: unreconciledAccounts,
  unreconciledTransactions: unreconciledTransactions,
  chartOfAccounts: chartOfAccounts
};