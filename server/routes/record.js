const { userDBService } = require("../db/Account/Service/Iuserdatabsecrud.js");
const { MongoClient,ObjectId} = require("mongodb");
const { userinfo } = require("../db/Account/Model/User.js");
const { userlog } = require("../db/Account/Model/UserLog.js");
const {Flashcardset} = require ("../db/Flashcard/Model/Flashcardset.js")
const {Folder} = require("../db/Flashcard/Model/Folder.js");
const {Flashcard} = require("../db/Flashcard/Model/Flashcard.js");
const {FlascardDBService} = require("../db/Flashcard/Service/ilfashcard.js");
const cookieParser = require('cookie-parser');
const uri =
  "mongodb+srv://wang4633:Wwq010817@cluster0.asirh9k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });
const userdata = new userDBService();
const express = require("express");
const app = express();
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
app.use(cookieParser());
// recordRoutes is an instance of the express router.
const recordRoutes = express.Router();
// This will help us connect to the database
const dbo = require("../db/conn");
client.connect();
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
    const map = user.folder;
    map.set(res3.insertedId,await Flashcarddata.GetFolderasync(client,res3.insertedId));
    const obj = Object.fromEntries(map);
    user.folder = obj;
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
      console.log("account login sucessful");
      const newuserlog = new userlog(result._id, username,ip);
      await userdata.AddLogAsync(client, newuserlog);
      res.json(result._id);
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
  const uid = req.body.uid;
  console.log(uid);
  const newfolder = new Folder(foldername,uid);
  const object = await Flashcarddata.Createfolder(client,newfolder);
  const folder = await Flashcarddata.GetFolderasync(client,object.insertedId);
  if(object){
      const myuserobjectid = ObjectId(uid);
      const user = await userdata.GetAsyncbyid(client,myuserobjectid);
      const map = new Map(Object.entries(user.folder));
      map.set(object.insertedId,folder);
      const obj = Object.fromEntries(map);
      user.folder = obj;
      console.log(user.folder);
      await userdata.UpdateUser(client,ObjectId(uid.toString()),user);
      res.json(true);
  }
});
async function createFlashcard(front,back,belongsetid){
  const newflashcard = new Flashcard(front,back,belongsetid);
  const object = await Flashcarddata.CreateFlashcard(client,newflashcard);
  const card   = await Flashcarddata.GetFlashcardasync(client,object.insertedId);
  const belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(belongsetid));
  const json = JSON.stringify(belongset);
  const obj = JSON.parse(json);
  const map = new  Map(Object.entries(obj.flashcard));
  map.set(object.insertedId,card);
  const mapobj = Object.fromEntries(map);
  belongset.flashcard = mapobj;
  await Flashcarddata.UpdateSet(client,ObjectId(belongsetid),belongset);
}
recordRoutes.route("/createflashcardset").post(async function (req, res) {
  const list = req.body.inputList;
  const setname = req.body.name;
  const newset = new Flashcardset(setname);
  newset.private = req.body.statePrivate;
  const belongfolderid = req.body.folderid;
  newset.belongfolder = belongfolderid;
  const set = await Flashcarddata.CreateSet(client,newset);
  const belongfolder = await Flashcarddata.GetFolderasync(client,ObjectId(belongfolderid));
  const myObjectId = set.insertedId;
  const json = JSON.stringify(belongfolder);
  const obj = JSON.parse(json);
  const map = new Map(Object.entries(obj.flashcardset));
  map.set(set.insertedId,await Flashcarddata.GetFlashcardsetasync(client,set.insertedId));
  const mapobj = Object.fromEntries(map);
  belongfolder.flashcardset = mapobj;
  await Flashcarddata.UpdateFolder(client,ObjectId(belongfolderid),belongfolder);
  for(var i=0;i<list.length;i++){
    await createFlashcard(list[i].front,list[i].back,myObjectId.toString())
  }
  res.json(true);
});
recordRoutes.route("/getcuurrentuser").get(async function (req, res) {
  res.json(currentuser);
});
recordRoutes.route("/deletFlashcard").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  console.log(flashcardid);
  const card = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardid));
  if (card){
    const belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(card.belongset));
    const json = JSON.stringify(belongset);
    const obj1 = JSON.parse(json);
    const map = new Map(Object.entries(obj1.flashcard));
    map.delete(flashcardid);
    const mapobj = Object.fromEntries(map);
    belongset.flashcard = mapobj;
    await Flashcarddata.UpdateSet(client,ObjectId(card.belongset),belongset);
  }
console.log(flashcardid);
await Flashcarddata.deleteFlashcard(client,ObjectId(flashcardid));
res.json(true);
});

recordRoutes.route("/deletFlashcardset").delete(async function (req, res) {
  const setid = req.body.setid;
  console.log("Delete set w/ id:" + req.body.setid);
  const set = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(setid.toString()));
  if (set){
    const belongfolder = await Flashcarddata.GetFolderasync(client,ObjectId(set.belongfolder));
    const json = JSON.stringify(belongfolder);
    const obj1 = JSON.parse(json);
    const map = new Map(Object.entries(obj1.flashcard));
    map.delete(setid);
    const mapobj = Object.fromEntries(map);
    belongfolder.flashcardset = mapobj;
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
  const flashcardarray = flashcardset.flashcard;
  const folderinfo = {
    flashcardset: flashcardset,
    flashcardarray: flashcardarray,
  }; 
  res.json(folderinfo);
});
recordRoutes.route("/folder").post(async function (req, res) {
  const folderid = req.body.folderid;
  const folder = await Flashcarddata.GetFolderasync(client,ObjectId(folderid.toString()));
  res.json(folder);
});
recordRoutes.route("/loadspace").post(async function (req, res) {
  const userid = req.body.uid;
  const user = await userdata.GetAsyncbyid(client,ObjectId(userid));
  res.json(user.folder);
});
recordRoutes.route("/search").post(async function (req, res) {
  const setname = req.body.setname;
  result = await Flashcarddata.searchSet(client,setname);
  res.json(result);
});
recordRoutes.route("/logout").post(async function (req, res) {
  res.json(false);
});
recordRoutes.route("/edit").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  const newfront = req.body.newfront;
  const newback = req.body.newback;
  const newflashcard = new Flashcard(newfront,newback);
  newflashcard.belongset = await Flashcarddata.GetFlashcardasync(client,flashcardid).belongset
  result = await Flashcarddata.UpdateFlashcard(client,ObjectId(flashcardid),newflashcard);
  res.json(true);
});
recordRoutes.route("/setpublic").post(async function (req, res) {
  const setid = req.body.flashcardid;
  const bool = req.body.public;
  const set = await Flashcarddata.GetFlashcardsetasync(client,setid);
  if(bool==0){
    set.private = false;
  }else{
    set.public = true;
  }
  await Flashcarddata.UpdateSet(client,setid,set);
  res.json(true);
});
recordRoutes.route("/editfolder").post(async function (req, res) {
  const folder = req.body.folder;
  const user = await userdata.GetAsyncbyid(client,ObjectId(folder.owner));
  const map = new Map(Object.entries(user.folder));
  map.set(folder._id,folder);
  console.log(map.get(folder._id));
  const mapobj = Object.fromEntries(map);
  console.log(mapobj);
  user.folder = mapobj;
  folder._id = ObjectId(folder._id);
  result = await Flashcarddata.UpdateFolder(client,ObjectId(folder._id),folder);
  await userdata.UpdateUser(client,ObjectId(user._id),user);
  res.json(true);
});
recordRoutes.route("/deletefolder").post(async function (req, res) {
  const folder = req.body.folder;
  const user = await userdata.GetAsyncbyid(client,ObjectId(folder.owner));
  const map = new Map(Object.entries(user.folder));
  map.delete(folder._id);
  const mapobj = Object.fromEntries(map);
  console.log(mapobj);
  user.folder = mapobj;
  folder._id = ObjectId(folder._id);
  result = await Flashcarddata.deleteFlashcardFolder(client,ObjectId(folder._id));
  await userdata.UpdateUser(client,ObjectId(user._id),user);
  res.json(true);
});
module.exports = recordRoutes;
