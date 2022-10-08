import { userDBService } from './Service/Iuserdatabsecrud.js';
import { MongoClient } from 'mongodb';
import { userinfo } from './Model/User.js';
import { userlog } from './Model/UserLog.js';
const uri = "mongodb+srv://wang4633:Wwq010817@cluster0.asirh9k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const userdata = new userDBService();
await client.connect();
async function checkvalidusername(str){
    const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;
    if(usernameRegex.test(str)){
        if(await userdata.GetAsync(client,str)){
            console.log("username exist");
            return false;
        }else{
            console.log("username: "+str);
            return true;
        }
    }else{
        console.log("wrong format of username");
        return false;
    }
}
function checkvalidpassword(str){
    const passwordRegex = /^[A-Za-z0-9#?!@$%^&*-]{6,25}$/;
    if(passwordRegex.test(str)){
        console.log("nicepassword!: " +str);
        return true;
    }else{
        console.log("wrong format of password");
        return false;
    }
}
async function createaccount(){
    const username = "wang46333333";
    const password = "hbdafjkbdajk";
    const validateusername = await checkvalidusername(username);
    const validatepassword = checkvalidpassword(password);
    if(validateusername&&validatepassword){
        const user = new userinfo(username,password);
        await userdata.AddAsync(client,user);
    }

}
createaccount();
login();
changecredential();
async function login(){
    const username = "wang46333333";
    const password = "hbdafjkbdajk";
    const result = await userdata.GetAsync(client,username);
    if(result){
       if(result.password == password){
        console.log("account login sucessful");
        console.log(result);
        const newuserlog = new userlog(result._id,username);
        await userdata.AddLogAsync(client,newuserlog);
       }
    }else{
        console.log("no matching account/password");
    }

}
async function changecredential(){
    const username = "wang4633";
    const password = "hbdafjkbdajk";
    const result = await userdata.GetAsync(client,username);
    if(result.password == password){
        const newpassword = "afdindadnif";
        const newusername = "amdbluntz1";
        if(checkvalidpassword(newpassword)){
            const newuserinfo = new userinfo(newusername,newpassword);
            await userdata.UpdateAsync(client,username,newuserinfo);
        }
    }
    process.exit(0);
}