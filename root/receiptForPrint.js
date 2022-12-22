"use strict";
exports.__esModule = true;
var receipt = function (accountholderName, balance, moneyDeduct) {
    var msg = "\n                  Receipt\n      *******************************\n      \n        A/C Holder Name: ".concat(accountholderName, "\n        ----------------------\n        Money Deduct: ").concat(moneyDeduct, "\n        ----------------------\n        Available Balance: ").concat(balance, "\n          \n      *******************************\n      ");
    return msg;
};
exports["default"] = receipt;
