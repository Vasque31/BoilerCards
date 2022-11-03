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
async function createFlashcard(front,back,belongsetid,difficulty){
  const newflashcard = new Flashcard(front,back,belongsetid);
  newflashcard.difficulty = difficulty;
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
  //console.log(req.body)
  const list = req.body.inputList;
  const setname = req.body.name;
  const newset = new Flashcardset(setname);
  if(req.body.statePrivate==true||req.body.statePrivate=="true"){
    newset.private = true;
  }else{
    newset.private = false;
  }
  //console.log(newset.private);
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
    await createFlashcard(list[i].front,list[i].back,myObjectId.toString(),list[i].drate)
  }
  res.json(true);
});
recordRoutes.route("/addmoreFlashcards").post(async function (req, res) {
  const setid = req.body.setid; 
  const list = req.body.inputList;
  for(var i=0;i<list.length;i++){
    await createFlashcard(list[i].front,list[i].back,setid.toString())
  }
  res.json(true);
});
recordRoutes.route("/getcuurrentuser").get(async function (req, res) {
  res.json(currentuser);
});
recordRoutes.route("/deletFlashcard").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  //console.log(flashcardid);
  const card = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardid));
  if (card){
    const belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(card.belongset));
    const map = new Map(Object.entries(belongset.flashcard));
    map.delete(flashcardid);
    const mapobj = Object.fromEntries(map);
    belongset.flashcard = mapobj;
    await Flashcarddata.UpdateSet(client,ObjectId(card.belongset),belongset);
  }
await Flashcarddata.deleteFlashcard(client,ObjectId(flashcardid));
res.json(true);
});

recordRoutes.route("/deleteset").post(async function (req, res) {
  const setid = req.body.setid;
  const set = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(setid.toString()));
  console.log(set);
  if (set){
    const belongfolder = await Flashcarddata.GetFolderasync(client,ObjectId(set.belongfolder));
    //console.log(belongfolder);
    const json = JSON.stringify(belongfolder);
    const obj1 = JSON.parse(json);
    const map = new Map(Object.entries(obj1.flashcardset));
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
  //console.log(flashcardid);
  const card = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardid.toString()));
  res.json(card);
});
recordRoutes.route("/flsahcardset").post(async function (req, res) {
  const setid = req.body.setid;
  const flashcardset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(setid.toString()));
  const flashcardarray = flashcardset.flashcard;
  const map = new Map(Object.entries(flashcardarray));
  const array = Array.from(map.values());
  const sortedarray = insertionSort(array,array.length);
  const folderinfo = {
    flashcardset: flashcardset,
    flashcardarray: flashcardarray,
    sortedarray: sortedarray
  }; 
  //console.log(sortedarray);
  res.json(folderinfo);
});
function insertionSort(arr, n) 
{ 
    let i, key, j; 
    for (i = 1; i < n; i++)
    { 
        key = arr[i]; 
        j = i - 1; 
        while (j >= 0 && arr[j].difficulty < key.difficulty)
        { 
            arr[j + 1] = arr[j]; 
            j = j - 1; 
        } 
        arr[j + 1] = key; 
    }
  return arr;
}
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
  const oldflashcard = await Flashcarddata.GetFlashcardasync(client,ObjectId(flashcardid));
  oldflashcard.front = req.body.newfront;
  oldflashcard.back = req.body.newback;
  result = await Flashcarddata.UpdateFlashcard(client,ObjectId(flashcardid),oldflashcard);
  belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(oldflashcard.belongset));
  const map = new Map(Object.entries(belongset.flashcard));
  map.set(flashcardid,oldflashcard);
  const mapobj = Object.fromEntries(map);
  belongset.flashcard = mapobj;
  result = await Flashcarddata.UpdateSet(client,ObjectId(belongset._id),belongset);
  res.json(true);
});
recordRoutes.route("/setpublic").post(async function (req, res) {
  const setid = req.body.status.id;
  const bool = req.body.status.shared;
  const set = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(setid));
  if(bool=="false"){
    set.private = false;
    console.log("false");
  }if(bool=="true"){
    set.private = true;
    console.log("true");
  }
  await Flashcarddata.UpdateSet(client,ObjectId(setid),set);
  res.json(true);
});
recordRoutes.route("/editfolder").post(async function (req, res) {
  const folder = req.body.folder;
  const user = await userdata.GetAsyncbyid(client,ObjectId(folder.owner));
  const map = new Map(Object.entries(user.folder));
  map.set(folder._id,folder);
  //console.log(map.get(folder._id));
  const mapobj = Object.fromEntries(map);
 // console.log(mapobj);
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
  //console.log(mapobj);
  user.folder = mapobj;
  folder._id = ObjectId(folder._id);
  result = await Flashcarddata.deleteFlashcardFolder(client,ObjectId(folder._id));
  await userdata.UpdateUser(client,ObjectId(user._id),user);
  res.json(true);
});
recordRoutes.route("/groupcopy").post(async function (req, res) {
  const groups = req.body.groups;
  const dest = req.body.dest;
  //console.log(groups[0].setid);
  const folder = await Flashcarddata.GetFolderasync(client,ObjectId(dest));
  for(i=0;i<groups.length;i++){
    const oldset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(groups[i].setid));
    var flashcardarray = new Map(Object.entries(oldset.flashcard));
    flashcardarray = Array.from(flashcardarray.values());
    const newflashcardmap = new Map();
    const newset = oldset;
    delete newset._id;
    newset.belongfolder = dest;
    const result = await Flashcarddata.CreateSet(client,newset);
    const map = new Map(Object.entries(folder.flashcardset));
    map.set(result.insertedId,await Flashcarddata.GetFlashcardsetasync(client,result.insertedId));
    const mapobj = Object.fromEntries(map);
    folder.flashcardset = mapobj;
    await Flashcarddata.UpdateFolder(client,ObjectId(dest),folder);
    const finalset = await Flashcarddata.GetFlashcardsetasync(client,result.insertedId);
    for(j=0;j<flashcardarray.length;j++){
      const newflashcard = flashcardarray[j];
      delete newflashcard._id;
      const result = await Flashcarddata.CreateFlashcard(client,newflashcard);
      newflashcardmap.set(result.insertedId,await Flashcarddata.GetFlashcardasync(client,result.insertedId));
      const mapobj = Object.fromEntries(newflashcardmap);
      finalset.flashcard = mapobj;
      await Flashcarddata.UpdateSet(client,ObjectId(finalset._id),finalset);
    }
  }
  res.json(true);
});
recordRoutes.route("/groupdelete").post(async function (req, res) {
  const groups = req.body.groups;
  var folder = req.body.folder;
  folder = await Flashcarddata.GetFolderasync(client,ObjectId(folder._id));
  for(i=0;i<groups.length;i++){
    await Flashcarddata.deleteSet(client,ObjectId(groups[i].setid));
    var map = new Map(Object.entries(folder.flashcardset));
    map.delete(groups[i].setid);
    console.log(map);
    folder.flashcardset = Object.fromEntries(map);
    await Flashcarddata.UpdateFolder(client,ObjectId(folder._id),folder);
  }
  res.json(true);
});
recordRoutes.route("/groupmove").post(async function (req, res) {
  const groups = req.body.groups;
  var folder = req.body.folder;
  const dest = req.body.dest;
  const destfolder = await Flashcarddata.GetFolderasync(client,ObjectId(dest));
  folder = await Flashcarddata.GetFolderasync(client,ObjectId(folder._id));
  for(i=0;i<groups.length;i++){
    var map = new Map(Object.entries(folder.flashcardset));
    map.delete(groups[i].setid);
    console.log(map);
    folder.flashcardset = Object.fromEntries(map);
    await Flashcarddata.UpdateFolder(client,ObjectId(folder._id),folder);
    var set = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(groups[i].setid));
    set.belongfolder = dest;
    await Flashcarddata.UpdateSet(client,ObjectId(set._id),set);
    var destmap = new Map(Object.entries(destfolder.flashcardset));
    destmap.set(set._id,set);
    destfolder.flashcardset = Object.fromEntries(destmap);
    await Flashcarddata.UpdateFolder(client,ObjectId(dest),destfolder);

  }
  res.json(true);
});
module.exports = recordRoutes;
