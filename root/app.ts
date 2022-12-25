import inquirer, { NumberQuestion } from "inquirer";
import chalkAnimation from "chalk-animation";
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
  constructor(
    readonly account_number: number,
    readonly account_title: string,
    private _pincode: number,
    private _balance: number
  ) {}
  get pincode() {
    return this._pincode;
  }
  get balance() {
    return this._balance;
  }
  set balance(value: number) {
    if (value < 0) throw new Error("Invalid Balance");
    this._balance = value;
  }
}
let user1 = new Bank(123_456_567, "Muhammad Tufail", 1234, 100_000);
let user2 = new Bank(567_234_3456, "Muhammad Khubaib", 4321, 50_000);
let user3 = new Bank(345_1234_567, "Muhammad Uzair", 5678, 60_000);
let bankData = [user1, user2, user3];
let restart = true;
let pinError = true;
let userExist: any;
let userPin: any;
do {
  let accNo: {
    account_No: number;
  } = await inquirer.prompt({
    name: "account_No",
    message: "Please Enter your Account Number",
    type: "number",
  });
  userExist = bankData.findIndex(
    (obj) => obj.account_number === accNo.account_No
  );
  if (userExist != -1) {
    do {
      let pinCode: {
        pin_Code: number;
      } = await inquirer.prompt({
        name: "pin_Code",
        message: "Please Enter your PinCode Number",
        type: "number",
      });
      userPin = bankData[userExist].pincode === pinCode.pin_Code;
      if (userPin) {
        pinError = false;
      } else {
        console.log(`Invalid PinCode`);
      }
    } while (pinError);
    restart = false;
  } else {
    console.log(`Invalid Account Number`);
  }
} while (restart);

let mainMenu = async (userPara: any, balancePara: number) => {
  let menu: {
    select_menu: string;
  } = await inquirer.prompt({
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
let withdraw = async (userPara: any, balancePara: number) => {
  let withdrawmoney: {
    money_withdraw: number;
  } = await inquirer.prompt({
    name: `money_withdraw`,
    message: `Enter the amount of money you want to withdraw`,
    type: `number`,
  });
  bankData[balancePara].balance =
    bankData[balancePara].balance - withdrawmoney.money_withdraw;
  console.log(`Your remaining balance is ${bankData[balancePara].balance}`);
  let receiptPrint: {
    receipt_print: boolean;
  } = await inquirer.prompt({
    name: "receipt_print",
    message: `Do you want to print Recepit`,
    type: `confirm`,
  });
  if (receiptPrint.receipt_print) {
    console.log(
      chalk.greenBright(
        receipt(
          bankData[balancePara].account_title,
          bankData[balancePara].balance,
          withdrawmoney.money_withdraw
        )
      )
    );
  }
};

if (userExist != -1 && userPin == true) {
  mainMenu(bankData[userExist], userExist);
}

let reDo = async (userPara: any, balancePara: number) => {
  let continueUsing = await inquirer.prompt({
    name: `askUser`,
    message: `Do you want more Transaction => Y/N`,
  });
  if (continueUsing.askUser) await mainMenu(userPara, balancePara);
};
