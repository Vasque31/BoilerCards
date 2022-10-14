const { userDBService } = require("../db/Account/Service/Iuserdatabsecrud.js");
const { MongoClient,ObjectId} = require("mongodb");
const { userinfo } = require("../db/Account/Model/User.js");
const { userlog } = require("../db/Account/Model/UserLog.js");
const {Flashcardset} = require ("../db/Flashcard/Model/Flashcardset.js")
const {Folder} = require("../db/Flashcard/Model/Folder.js");
const {Flashcard} = require("../db/Flashcard/Model/Flashcard.js");
const {FlascardDBService} = require("../db/Flashcard/Service/ilfashcard.js");
const uri =
  "mongodb+srv://wang4633:Wwq010817@cluster0.asirh9k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });
const userdata = new userDBService();
const express = require("express");
// recordRoutes is an instance of the express router.
const recordRoutes = express.Router();
// This will help us connect to the database
const dbo = require("../db/conn");
client.connect();
var currentuser;
// This section will help you get a list of all the records.
const Flashcarddata = new  FlascardDBService();

recordRoutes.route("/createaccount").post(async function (req, res) {
  const username = req.body.registrationInfo.username;
  const password = req.body.registrationInfo.password;
  if (await userdata.GetAsync(client, username)) {
    console.log("username exist");
    res.json(false);
    return;
  } else {
    const user = new userinfo(username, password);
    const res2 = await userdata.AddAsync(client, user);
    const newfolder = new Folder("Home",res2.insertedId);
    const res3 = await Flashcarddata.Createfolder(client,newfolder);
    user.defaultfolder = res3.insertedId.toString();
    const array = user.folder;
    array.push(user.defaultfolder);
    user.folder = array;
    await userdata.UpdateUser(client,res2.insertedId,user);
    res.json(true);
    return;
  }
});

recordRoutes.route("/signin").post(async function (req, res) {
  const username = req.body.logginfo.username;
  const password = req.body.logginfo.password;
  const ip = req.body.logginfo.ip;
  const result = await userdata.GetAsync(client, username);
  if (result) {
    
    if (result.password == password) {
      currentuser = result;
      console.log("account login sucessful");
      console.log(currentuser);
      const newuserlog = new userlog(result._id, username,ip);
      await userdata.AddLogAsync(client, newuserlog);
      res.json(true);
      return;
    }
    else{
      res.json(false);
      return;
    }
  }
  else {
    res.json(false);
  } 
});

// This section will help you update a record by id.
recordRoutes.route("/changecredential").post(async function (req, res) {
  const oldusername = req.body.oldusername;

  const oldpassword = req.body.oldpassword;

  const result = await userdata.GetAsync(client, oldusername);
  
  if (result.password == oldpassword) {
    const newuserinfo = result;
    const newpassword = req.body.newpassword;
    const newusername = req.body.newusername;
    newuserinfo.username = newusername;
    newuserinfo.password = newpassword;
    await userdata.UpdateAsync(client, oldusername, newuserinfo);
    res.json(true);
  }else{
    res.json(false);
  }
});

recordRoutes.route("/createfolder").post(async function (req, res) {
  const foldername = req.body.folderName;
  const uid = currentuser._id;
  const newfolder = new Folder(foldername,uid);
  const object = await Flashcarddata.Createfolder(client,newfolder);
  const myObjectId = ObjectId(object.insertedId);
  const user = await userdata.GetAsyncbyid(client,uid);
  const folderarray = user.folder;
  folderarray.push(myObjectId.toString());
  user.folder = folderarray;
  await userdata.UpdateUser(client,ObjectId(uid.toString()),user);
  res.json(true);
});
async function createFlashcard(front,back,belongsetid){
  const newflashcard = new Flashcard(front,back,belongsetid);
  const card = await Flashcarddata.CreateFlashcard(client,newflashcard);
  const belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(belongsetid));
  const json = JSON.stringify(belongset);
  const obj = JSON.parse(json);
  const array = obj.flashcard;
  const myObjectId = ObjectId(card.insertedId);
  array.push(myObjectId.toString());
  belongset.flashcard = array;
  Flashcarddata.UpdateSet(client,ObjectId(belongsetid),belongset);
}
recordRoutes.route("/createflashcardsethome").post(async function (req, res) {
  const list = req.body.inputList;
  const setname = req.body.name;
  const newset = new Flashcardset(setname);
  newset.belongfolder = currentuser.defaultfolder;
  const set = await Flashcarddata.CreateSet(client,newset);
  const belongfolder = await Flashcarddata.GetFolderasync(client,ObjectId(currentuser.defaultfolder.toString()));
  const json = JSON.stringify(belongfolder);
  const obj = JSON.parse(json);
  const array = obj.flashcardset;
  const myObjectId = ObjectId(set.insertedId);
  array.push(myObjectId.toString());
  belongfolder.flashcardset = array;
  await Flashcarddata.UpdateFolder(client,ObjectId(currentuser.defaultfolder.toString()),belongfolder);
  for(var i=0;i<list.length;i++){
    await createFlashcard(list[i].front,list[i].back,myObjectId.toString())
  }
  res.json(true);
});
recordRoutes.route("/getcuurrentuser").get(async function (req, res) {
  res.json(currentuser);
});

recordRoutes.route("/createFlashcard").post(async function (req, res) {
  const front = req.body.flashcardinfo.front;
  const back = req.body.flashcardinfo.back;
  const belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(req.body.flashcardinfo.belongset.toString()));
  const newflashcard = new Flashcard(front,back);
  newflashcard.belongset = belongset;
  const card = await Flashcarddata.CreateFlashcard(client,newflashcard);
  const json = JSON.stringify(belongset);
  const obj = JSON.parse(json);
  const array = obj.flashcard;
  const myObjectId = ObjectId(card.insertedId);
  array.push(myObjectId.toString());
  belongset.flashcard = array;
  await Flashcarddata.UpdateSet(client,ObjectId(req.body.flashcardinfo.belongset.toString()),belongset);
  res.json(true);
});

recordRoutes.route("/deletFlashcard").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  console.log(flashcardid);
  const card = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardid));
  if (card){
    const belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(card.belongset));
    const json = JSON.stringify(belongset);
    const obj1 = JSON.parse(json);
    const obj = obj1.flashcard;
    for( var i = 0; i < obj.length; i++){                                 
        if ( obj[i] === flashcardid.toString()) { 
            obj.splice(i, 1); 
            break;
        }
    }
    belongset.flashcard = obj;
    await Flashcarddata.UpdateSet(client,ObjectId(card.belongset),belongset);
  }
console.log(flashcardid);
await Flashcarddata.deleteFlashcard(client,ObjectId(flashcardid));
res.json(true);
});

recordRoutes.route("/deletFlashcardset").delete(async function (req, res) {
  const setid = req.body.setinfo.setid;
  const set = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(setid.toString()));
  if (set){
    const belongfolder = await Flashcarddata.GetFolderasync(client,ObjectId(set.belongfolder));
    const json = JSON.stringify(belongfolder);
    const obj1 = JSON.parse(json);
    const obj = obj1.flashcardset;
    for( var i = 0; i < obj.length; i++){                                 
        if ( obj[i] === set.belongfolder) { 
            obj.splice(i, 1); 
            break;
        }
    }
    belongfolder.flashcardset = obj;
    await Flashcarddata.UpdateFolder(client,belongfolder._id,belongfolder);
}
await Flashcarddata.deleteSet(client,ObjectId(setid.toString()));
res.json(true);
});
recordRoutes.route("/flsahcard").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  const card = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardid.toString()));
  res.json(card);
});
recordRoutes.route("/flsahcardset").post(async function (req, res) {
  const setid = req.body.setid;
  const flashcardset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(setid.toString()));
  const flashcardarray = new Array();
  for(var i=0;i<flashcardset.flashcard.length;i++){
    const flashcard = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardset.flashcard[i].toString()));
    flashcardarray.push(flashcard);
  }
  const folderinfo = {
    flashcardset: flashcardset,
    flashcardarray: flashcardarray,
  }; 
  res.json(folderinfo);
});
recordRoutes.route("/folder").post(async function (req, res) {
  const folderid = req.body.folderid;
  const folder = await Flashcarddata.GetFolderasync(client,ObjectId(folderid.toString()));
  const setarray = new Array();
  for(var i=0;i<folder.flashcardset.length;i++){
    const set = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(folder.flashcardset[i].toString()));
    setarray.push(set);
  }
  const folderinfo = {
    folder: folder,
    setarray: setarray,
  }; 
  res.json(folderinfo);
});

/*recordRoutes.route("/signin").post(async function (req, res) {
  const username = req.body.logginfo.username;
  const password = req.body.logginfo.password;
  const ip = req.body.logginfo.ip;*/
recordRoutes.route("/loadspace").post(async function (req, res) {
  const userid = req.body.uid;
  const user = await userdata.GetAsyncbyid(client,ObjectId(userid));
  const fodlerarray = new Array();
  for(var i=0;i<user.folder.length;i++){
    const folder = await Flashcarddata.GetFolderasync(client,ObjectId(user.folder[i].toString()));
    fodlerarray.push(folder);
  }
  res.json(fodlerarray);
});
recordRoutes.route("/search").post(async function (req, res) {
  const setname = req.body.setname;
  result = await Flashcarddata.searchSet(client,setname);
  res.json(result);
});
recordRoutes.route("/logout").post(async function (req, res) {
  currentuser = null;
  res.json(false);
});
recordRoutes.route("/edit").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  const newfront = req.body.newfront;
  const newback = req.body.newback;
  const newflashcard = new Flashcard(newfront,newback);
  result = await Flashcarddata.UpdateFlashcard(client,ObjectId(flashcardid),newflashcard);
  res.json(true);
});
module.exports = recordRoutes;
