import  moment from 'moment';
export class userinfo{ 
    constructor(username,password) {
        this.username = username;
        this.password = password;
        this.AccountCreateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.folder = new Array();
    }
     
}