const moment = require("moment");
class teacherAccount {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.AccountCreateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    this.class = new Array();
  }
}
exports.teacherAccount = teacherAccount;
