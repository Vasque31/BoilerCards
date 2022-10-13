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
// This section will help you get a list of all the records.
const Flashcarddata = new  FlascardDBService();

recordRoutes.route("/createaccount").post(async function (req, res) {
  const username = req.body.logginfo.username;
  const password = req.body.logginfo.password;
  if (await userdata.GetAsync(client, username)) {
    console.log("username exist");
    res.json(false);
    return;
  } else {
    console.log("username: " + str);
    const user = new userinfo(username, password);
    await userdata.AddAsync(client, user);
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
      console.log("account login sucessful");
      console.log(result);
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
  const username = req.body.logginfo.username;
  const oldpassword = req.body.logginfo.oldpassword;
  const result = await userdata.GetAsync(client, username);
  if (result.password == oldpassword) {
    const newpassword = req.body.logginfo.newpassword;
    const newusername = req.body.logginfo.newusername;
    const newuserinfo = new userinfo(newusername, newpassword);
    await userdata.UpdateAsync(client, username, newuserinfo);
    res.json(true);
  }else{
    res.json(false);
  }
});

recordRoutes.route("/createfolder").post(async function (req, res) {
  const foldername = req.body.folderinfo.foldername;
  const uid = req.body.folderinfo.uid;
  const newfolder = new Folder(foldername,uid);
  const object = await Flashcarddata.Createfolder(client,newfolder);
  const myObjectId = ObjectId(object.insertedId);
  const user = await userdata.GetAsyncbyid(client,uid);
  const folderarray = user.folder;
  folderarray.push(myObjectId.toString());
  user.folder = folderarray;
  userdata.UpdateUser(client,ObjectId(uid.toString()),user);
  res.json(true);
});

recordRoutes.route("/createflashcardset").post(async function (req, res) {
  const setname = req.body.setinfo.setname;
  const newset = new Flashcardset(setname);
  newset.belongfolder = req.body.setinfo.belongfolder;
  const set = await Flashcarddata.CreateSet(client,newset);
  const belongfolder = await Flashcarddata.GetFolderasync(client,ObjectId(req.body.setinfo.belongfolder.toString()));
  const json = JSON.stringify(belongfolder);
  const obj = JSON.parse(json);
  const array = obj.flashcardset;
  const myObjectId = ObjectId(set.insertedId);
  array.push(myObjectId.toString());
  belongfolder.flashcardset = array;
  Flashcarddata.UpdateFolder(client,ObjectId(req.body.setinfo.belongfolder.toString()),belongfolder);
  res.json(true);
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
  Flashcarddata.UpdateSet(client,ObjectId(req.body.flashcardinfo.belongset.toString()),belongset);
  res.json(true);
});

recordRoutes.route("/deletFlashcard").delete(async function (req, res) {
  const flashcardid = req.body.flashcardinfo.flashcardid;
  const card = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardid.toString()));
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
    Flashcarddata.UpdateSet(client,ObjectId(card.belongset),belongset);
  }
await Flashcarddata.deleteFlashcard(client,ObjectId(flashcardid.toString()));
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
    Flashcarddata.UpdateFolder(client,belongfolder._id,belongfolder);
}
await Flashcarddata.deleteSet(client,ObjectId(setid.toString()));
res.json(true);
});
recordRoutes.route("/flsahcard").get(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  const card = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardid.toString()));
  res.json(card);
});
recordRoutes.route("/flsahcardset").get(async function (req, res) {
  const setid = req.body.setid;
  const set = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(setid.toString()));
  res.json(set);
});
recordRoutes.route("/folder").get(async function (req, res) {
  const folderid = req.body.folderid;
  const folder = await Flashcarddata.GetFolderasync(client,ObjectId(folderid.toString()));
  res.json(folder);
});
recordRoutes.route("/loaduserspace").get(async function (req, res) {
  const userid = req.body.uid;
  const user = await userdata.GetAsync(client,userid);
  res.json(user.folder);
});
recordRoutes.route("/search").get(async function (req, res) {
  const setname = req.body.setname;
  result = await Flashcarddata.searchSet(client,setname);
  res.json(result);
});
module.exports = recordRoutes;