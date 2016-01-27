/**
 * Created by ryanknell on 9/11/2015.
 */
var xeroRequest = require('./request');
var q = require('q');

function reconcileTransaction(agent, bankAcctId, statementLineId, customerId, customerName, accountId, taxType, description) {
  var deferred = q.defer();
  agent.get("https://go.xero.com/Bank/BankRec.aspx?accountID=" + bankAcctId, function (err, res, body) {
    var url = "https://go.xero.com/ajaxpro/Bank_BankRec.ashx?accountID=" + bankAcctId;

    var payload = [
      "1",
      bankAcctId.toLowerCase(),
      statementLineId,
      customerId,
      customerName,
      accountId,
      taxType,
      description,
      null,
      null,
      null,
      null,
      null
    ];

    //var payload = ["7", "13918178-849a-4823-9a31-57b7eac713d7", statementLineId, "58697449-85ef-46ae-83fc-6a9446f037fb", "132 Collins", "e2bacdc6-2006-43c2-a5da-3c0e5f43b452", "GST/OUTPUT", "working", null, null, null, null, null]

    var headers = {
      "Content-Type": "text/plain; charset=UTF-8",
      Host: "go.xero.com",
      Origin: "https://go.xero.com",
      "X-AjaxPro-Method": "SaveFastPayment",
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate",
      "X-FirePHP-Version": "0.0.6",
      "Accept-Language": "en-US,en;q=0.8,en-AU;q=0.6",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Pragma": "no-cache",
      "Referer": "https://go.xero.com/Bank/BankRec.aspx?accountID=13918178-849A-4823-9A31-57B7EAC713D7",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36"
    };

    console.log(url, payload);
    xeroRequest.post(agent, url, payload, headers).then(deferred.resolve).catch(deferred.reject);
  });

  return deferred.promise;

}

function editDiscuss(agent, bankAcctId, statementLineId, description) {
  var deferred = q.defer();
  agent.get("https://go.xero.com/Bank/BankRec.aspx?accountID=" + bankAcctId, function (err, res, body) {
    var url = "https://go.xero.com/ajaxpro/Bank_BankRec.ashx?accountID=" + bankAcctId;

    var payload = [
      "1",
      bankAcctId.toLowerCase(),
      statementLineId,
      description
    ];

    var headers = {
      //"Content-Type": "text/plain; charset=UTF-8",
      //Host: "go.xero.com",
      //Origin: "https://go.xero.com",
      "X-AjaxPro-Method": "SaveStatementLineComments",
      //"Accept": "*/*",
      //"Accept-Encoding": "gzip, deflate",
      //"X-FirePHP-Version": "0.0.6",
      //"Accept-Language": "en-US,en;q=0.8,en-AU;q=0.6",
      //"Cache-Control": "no-cache",
      //"Connection": "keep-alive",
      //"Pragma": "no-cache",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36"
    };

    console.log(url, payload);
    xeroRequest.post(agent, url, payload, headers)
      .then(deferred.resolve)
      .catch(deferred.reject);
  });

  return deferred.promise;
}

//PoST to
//["9", - Index on page
// "13918178-849a-4823-9a31-57b7eac713d7", - Bank account id
// "740559A5-6354-47F1-8E56-70FF9CB642A3", - StatementLineID
// "1c40da58-fe1d-4e97-b729-b2abdae94d9e", - CustomerId
// "David Jones", - Customer Name
// "959af5f4-9925-44e8-b283-7ddf4b427238", - AccountId
// "GST/EXEMPTEXPENSES", - Type
// "Test", - Description
// null,
// null,
// null,
// null,
// null]

//var _GSTData = {
//  "Rows": [{
//    "Code": "GST/BASEXCLUDED",
//    "DisplayName": "BAS Excluded",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": true,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": true,
//    "TotalPercentageIncCompound": 0.0000,
//    "TotalDisplayPercentage": 0.0000
//  }, {
//    "Code": "GST/EXEMPTCAPITAL",
//    "DisplayName": "GST Free Capital",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": true,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": false,
//    "TotalPercentageIncCompound": 0.0000,
//    "TotalDisplayPercentage": 0.0000
//  }, {
//    "Code": "GST/EXEMPTEXPENSES",
//    "DisplayName": "GST Free Expenses",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": true,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": false,
//    "TotalPercentageIncCompound": 0.0000,
//    "TotalDisplayPercentage": 0.0000
//  }, {
//    "Code": "GST/EXEMPTEXPORT",
//    "DisplayName": "GST Free Exports",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": false,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": true,
//    "TotalPercentageIncCompound": 0.0000,
//    "TotalDisplayPercentage": 0.0000
//  }, {
//    "Code": "GST/EXEMPTOUTPUT",
//    "DisplayName": "GST Free Income",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": false,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": true,
//    "TotalPercentageIncCompound": 0.0000,
//    "TotalDisplayPercentage": 0.0000
//  }, {
//    "Code": "GST/CAPEXINPUT",
//    "DisplayName": "GST on Capital",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": true,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": false,
//    "TotalPercentageIncCompound": 10.0000,
//    "TotalDisplayPercentage": 10.0000
//  }, {
//    "Code": "GST/GSTONCAPIMPORTS",
//    "DisplayName": "GST on Capital Imports",
//    "AllowForAssets": false,
//    "AllowForEquity": false,
//    "AllowForExpenses": false,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": false,
//    "TotalPercentageIncCompound": 0.0000,
//    "TotalDisplayPercentage": 0.0000
//  }, {
//    "Code": "GST/INPUT",
//    "DisplayName": "GST on Expenses",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": true,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": false,
//    "TotalPercentageIncCompound": 10.0000,
//    "TotalDisplayPercentage": 10.0000
//  }, {
//    "Code": "GST/GSTONIMPORTS",
//    "DisplayName": "GST on Imports",
//    "AllowForAssets": false,
//    "AllowForEquity": false,
//    "AllowForExpenses": false,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": false,
//    "TotalPercentageIncCompound": 0.0000,
//    "TotalDisplayPercentage": 0.0000
//  }, {
//    "Code": "GST/OUTPUT",
//    "DisplayName": "GST on Income",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": false,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": true,
//    "TotalPercentageIncCompound": 10.0000,
//    "TotalDisplayPercentage": 10.0000
//  }, {
//    "Code": "GST/INPUTTAXED",
//    "DisplayName": "Input Taxed",
//    "AllowForAssets": true,
//    "AllowForEquity": true,
//    "AllowForExpenses": true,
//    "AllowForLiabilities": true,
//    "AllowForRevenue": true,
//    "TotalPercentageIncCompound": 0.0000,
//    "TotalDisplayPercentage": 0.0000
//  }]
//};

module.exports = {
  reconcileTransaction: reconcileTransaction,
  editDiscuss: editDiscuss
};