const moment = require("moment");

class userlog {
  constructor(uid, username,ip) {
    this.uid = uid;
    this.username = username;
    this.ip = ip;
    this.Accountlogintime = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
exports.userlog = userlog;
