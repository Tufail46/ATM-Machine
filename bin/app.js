import inquirer from "inquirer";
import chalk from "chalk";
import welcome from "./welcome.js";
import receipt from "./receiptForPrint.js";
let msg = `
    *************************************
    **** Welcome to MT ATM-Machine ****
    *************************************
`;
await welcome(msg);
class Bank {
    account_number;
    account_title;
    _pincode;
    _balance;
    constructor(account_number, account_title, _pincode, _balance) {
        this.account_number = account_number;
        this.account_title = account_title;
        this._pincode = _pincode;
        this._balance = _balance;
    }
    get pincode() {
        return this._pincode;
    }
    get balance() {
        return this._balance;
    }
    set balance(value) {
        if (value < 0)
            throw new Error("Invalid Balance");
        this._balance = value;
    }
}
let user1 = new Bank(123456567, "Muhammad Tufail", 1234, 100000);
let user2 = new Bank(5672343456, "Muhammad Khubaib", 4321, 50000);
let user3 = new Bank(3451234567, "Muhammad Uzair", 5678, 60000);
let bankData = [user1, user2, user3];
let restart = true;
let pinError = true;
let userExist;
let userPin;
do {
    let accNo = await inquirer.prompt({
        name: "account_No",
        message: "Please Enter your Account Number",
        type: "number",
    });
    userExist = bankData.findIndex((obj) => obj.account_number === accNo.account_No);
    if (userExist != -1) {
        do {
            let pinCode = await inquirer.prompt({
                name: "pin_Code",
                message: "Please Enter your PinCode Number",
                type: "number",
            });
            userPin = bankData[userExist].pincode === pinCode.pin_Code;
            if (userPin) {
                pinError = false;
            }
            else {
                console.log(`Invalid PinCode`);
            }
        } while (pinError);
        restart = false;
    }
    else {
        console.log(`Invalid Account Number`);
    }
} while (restart);
let mainMenu = async (userPara, balancePara) => {
    let menu = await inquirer.prompt({
        name: `select_menu`,
        type: `list`,
        choices: [`Balance Inquiry`, `Cash Withdraw`],
    });
    switch (menu.select_menu) {
        case `Balance Inquiry`:
            console.log(`Your current balance is ${userPara["balance"]}PKR`);
            reDo(userPara, balancePara);
            break;
        case `Cash Withdraw`:
            await withdraw(userPara, balancePara);
            await reDo(userPara, balancePara);
            break;
    }
};
let withdraw = async (userPara, balancePara) => {
    let withdrawmoney = await inquirer.prompt({
        name: `money_withdraw`,
        message: `Enter the amount of money you want to withdraw`,
        type: `number`,
    });
    bankData[balancePara].balance =
        bankData[balancePara].balance - withdrawmoney.money_withdraw;
    console.log(`Your remaining balance is ${bankData[balancePara].balance}`);
    let receiptPrint = await inquirer.prompt({
        name: "receipt_print",
        message: `Do you want to print Recepit`,
        type: `confirm`,
    });
    if (receiptPrint.receipt_print) {
        console.log(chalk.greenBright(receipt(bankData[balancePara].account_title, bankData[balancePara].balance, withdrawmoney.money_withdraw)));
    }
};
if (userExist != -1 && userPin == true) {
    mainMenu(bankData[userExist], userExist);
}
let reDo = async (userPara, balancePara) => {
    let continueUsing = await inquirer.prompt({
        name: `askUser`,
        message: `Do you want more Transaction => Y/N`,
    });
    if (continueUsing.askUser)
        await mainMenu(userPara, balancePara);
};
