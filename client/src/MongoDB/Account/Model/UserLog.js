import  moment from 'moment';

export class userlog{ 
    constructor(uid,username) {
        this.uid = uid;
        this.username = username;
        this.ip = "NULL";
        this.Accountlogintime = moment().format("YYYY-MM-DD HH:mm:ss");
    }
   
}