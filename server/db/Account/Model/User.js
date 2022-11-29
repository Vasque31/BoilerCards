const moment = require("moment");
class userinfo {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.AccountCreateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    this.defaultfolder = null;
    this.folder = new Map();
    this.email = null;
    this.class = new Map();
  }
}
exports.userinfo = userinfo;
