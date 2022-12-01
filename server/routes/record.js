const { userDBService } = require("../db/Account/Service/Iuserdatabsecrud.js");
const { MongoClient, ObjectId } = require("mongodb");
const { userinfo } = require("../db/Account/Model/User.js");
const { userlog } = require("../db/Account/Model/UserLog.js");
const { Flashcardset } = require("../db/Flashcard/Model/Flashcardset.js");
const { Folder } = require("../db/Flashcard/Model/Folder.js");
const { Flashcard } = require("../db/Flashcard/Model/Flashcard.js");
const { FlascardDBService } = require("../db/Flashcard/Service/ilfashcard.js");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const imgbbUploader = require("imgbb-uploader");
//const {Label} = require("../db/Flashcard/Model/Label.js");
const uri =
  "mongodb+srv://wang4633:Wwq010817@cluster0.asirh9k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });
const userdata = new userDBService();
const express = require("express");
const app = express();
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
app.use(cookieParser());
// recordRoutes is an instance of the express router.
const recordRoutes = express.Router();
// This will help us connect to the database
const dbo = require("../db/conn");
const { set } = require("mongoose");
const { teacherAccount } = require("../db/Account/Model/teacherAccount.js");
client.connect();
// This section will help you get a list of all the records.
const Flashcarddata = new FlascardDBService();

recordRoutes.route("/createaccount").post(async function (req, res) {
  const username = req.body.registrationInfo.username;
  const password = req.body.registrationInfo.password;
  const email = req.body.registrationInfo.email;
  console.log(req.body.registrationInfo);
  if (await userdata.GetAsync(client, username)) {
    console.log("username exist");
    res.json(false);
    return;
  } else {
    const user = new userinfo(username, password);
    const res2 = await userdata.AddAsync(client, user);
    const newfolder = new Folder("Home", res2.insertedId);
    const res3 = await Flashcarddata.Createfolder(client, newfolder);
    user.defaultfolder = res3.insertedId.toString();
    const map = user.folder;
    map.set(
      res3.insertedId,
      await Flashcarddata.GetFolderasync(client, res3.insertedId)
    );
    const obj = Object.fromEntries(map);
    user.folder = obj;
    user.email = email;
    await userdata.UpdateUser(client, res2.insertedId, user);
    res.json(true);
    return;
  }
});
recordRoutes.route("/checkEmail").post(async function (req, res) {
  const email = req.body.email;
  const bool = await userdata.GetEmailAsync(client, email);
  if (bool != false) {
    res.json(true);
  } else {
    res.json(false);
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
      const newuserlog = new userlog(result._id, username, ip);
      await userdata.AddLogAsync(client, newuserlog);
      res.json(result._id);
      return;
    } else {
      res.json(false);
      return;
    }
  } else {
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
  } else {
    res.json(false);
  }
});

recordRoutes.route("/createfolder").post(async function (req, res) {
  const foldername = req.body.folderName;
  const uid = req.body.uid;
  const newfolder = new Folder(foldername, uid);
  var label = req.body.label;
  label = label.toLowerCase();
  newfolder.label = label;
  const object = await Flashcarddata.Createfolder(client, newfolder);
  const folder = await Flashcarddata.GetFolderasync(client, object.insertedId);
  var labelmap = await Flashcarddata.GetLabel(
    client,
    ObjectId("637287af2c8cf8c067cd2e58")
  );
  if (labelmap.map == null) {
    labelmap.map = new Map();
  } else {
    labelmap.map = new Map(Object.entries(labelmap.map));
  }
  if (labelmap.map.get(label) == null) {
    const map = new Map();
    map.set(folder._id.toString(), folder._id);
    labelmap.map.set(label, map);
    const subjectarray = await Flashcarddata.GetLabel(
      client,
      ObjectId("637287af2c8cf8c067cd2e59")
    );
    if (subjectarray.Map == null) {
      subjectarray.Map = new Map();
    }
    subjectarray.Map = new Map(Object.entries(subjectarray.Map));
    subjectarray.Map.set(label, label);
    subjectarray.Map = Object.fromEntries(subjectarray.Map);
    console.log("subjectarray is" + subjectarray);
    await Flashcarddata.UpdateLabel(
      client,
      ObjectId("637287af2c8cf8c067cd2e59"),
      subjectarray
    );
  } else {
    const map = new Map(Object.entries(labelmap.map.get(label)));
    map.set(folder._id.toString(), folder._id);
    labelmap.map.set(label, map);
  }
  await Flashcarddata.UpdateLabel(
    client,
    ObjectId("637287af2c8cf8c067cd2e58"),
    labelmap
  );
  if (object) {
    const myuserobjectid = ObjectId(uid);
    const user = await userdata.GetAsyncbyid(client, myuserobjectid);
    const map = new Map(Object.entries(user.folder));
    map.set(object.insertedId, folder);
    const obj = Object.fromEntries(map);
    user.folder = obj;
    //console.log(user.folder);
    await userdata.UpdateUser(client, ObjectId(uid.toString()), user);
    res.json(true);
  }
});
async function createFlashcard(front, back, belongsetid, difficulty, img) {
  const newflashcard = new Flashcard(front, back, belongsetid);
  newflashcard.difficulty = difficulty;
  if (img != "") {
    console.log(img);
    var base64Data = img.replace(/^data:image\/png;base64,/, "");
    require("fs").writeFile(
      "./image/out1.png",
      base64Data,
      "base64",
      function (err) {
        console.log("Results Received");
      }
    );
    await imgbbUploader(
      "72248618eddd9ac14a512e2864ab056c",
      "./image/out1.png"
    ).then((response) => (newflashcard.image = response.url));
  }
  console.log(newflashcard.image);
  const object = await Flashcarddata.CreateFlashcard(client, newflashcard);
  const card = await Flashcarddata.GetFlashcardasync(client, object.insertedId);
  const belongset = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(belongsetid)
  );
  const json = JSON.stringify(belongset);
  const obj = JSON.parse(json);
  const map = new Map(Object.entries(obj.flashcard));
  map.set(object.insertedId, card);
  const mapobj = Object.fromEntries(map);
  belongset.flashcard = mapobj;
  await Flashcarddata.UpdateSet(client, ObjectId(belongsetid), belongset);
}
recordRoutes.route("/googleSignin").post(async function (req, res) {
  const username = req.body.logginfo.username;
  const ip = req.body.logginfo.ip;
  const result = await userdata.GetAsync(client, username);
  if (result) {
    res.json(result._id);
  } else {
    res.json(false);
  }
});
recordRoutes.route("/createflashcardset").post(async function (req, res) {
  const list = req.body.inputList;
  //null statement check
  const setname = req.body.name;
  const newset = new Flashcardset(setname);
  if (req.body.public == true || req.body.public == "true") {
    newset.private = true;
    console.log(req.body.public);
  } else {
    newset.private = false;
    console.log(req.body.public);
  }
  //console.log(newset.private);
  const belongfolderid = req.body.folderid;
  newset.belongfolder = belongfolderid;
  const set = await Flashcarddata.CreateSet(client, newset);
  const belongfolder = await Flashcarddata.GetFolderasync(
    client,
    ObjectId(belongfolderid)
  );
  const myObjectId = set.insertedId;
  const json = JSON.stringify(belongfolder);
  const obj = JSON.parse(json);
  const map = new Map(Object.entries(obj.flashcardset));
  map.set(
    set.insertedId,
    await Flashcarddata.GetFlashcardsetasync(client, set.insertedId)
  );
  const mapobj = Object.fromEntries(map);
  belongfolder.flashcardset = mapobj;
  await Flashcarddata.UpdateFolder(
    client,
    ObjectId(belongfolderid),
    belongfolder
  );
  for (var i = 0; i < list.length; i++) {
    await createFlashcard(
      list[i].front,
      list[i].back,
      myObjectId.toString(),
      list[i].drate,
      list[i].img
    );
  }
  res.json(true);
});
recordRoutes.route("/addmoreFlashcards").post(async function (req, res) {
  const setid = req.body.setid;
  const list = req.body.inputList;
  for (var i = 0; i < list.length; i++) {
    await createFlashcard(
      list[i].front,
      list[i].back,
      setid.toString(),
      list[i].drate,
      list[i].img
    );
  }
  res.json(true);
});
recordRoutes.route("/getcuurrentuser").get(async function (req, res) {
  res.json(currentuser);
});
recordRoutes.route("/deletFlashcard").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  //console.log(flashcardid);
  const card = await Flashcarddata.GetFlashcardasync(
    client,
    ObjectId(flashcardid)
  );
  if (card) {
    const belongset = await Flashcarddata.GetFlashcardsetasync(
      client,
      ObjectId(card.belongset)
    );
    const map = new Map(Object.entries(belongset.flashcard));
    map.delete(flashcardid);
    const mapobj = Object.fromEntries(map);
    belongset.flashcard = mapobj;
    await Flashcarddata.UpdateSet(client, ObjectId(card.belongset), belongset);
  }
  await Flashcarddata.deleteFlashcard(client, ObjectId(flashcardid));
  res.json(true);
});

recordRoutes.route("/deleteset").post(async function (req, res) {
  const setid = req.body.setid;
  const set = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(setid.toString())
  );
  console.log(set);
  if (set) {
    const belongfolder = await Flashcarddata.GetFolderasync(
      client,
      ObjectId(set.belongfolder)
    );
    //console.log(belongfolder);
    const json = JSON.stringify(belongfolder);
    const obj1 = JSON.parse(json);
    const map = new Map(Object.entries(obj1.flashcardset));
    map.delete(setid);
    const mapobj = Object.fromEntries(map);
    belongfolder.flashcardset = mapobj;
    await Flashcarddata.UpdateFolder(client, belongfolder._id, belongfolder);
  }
  await Flashcarddata.deleteSet(client, ObjectId(setid.toString()));
  res.json(true);
});
recordRoutes.route("/flsahcard").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  //console.log(flashcardid);
  const card = await Flashcarddata.GetFlashcardasync(
    client,
    ObjectId(flashcardid.toString())
  );
  res.json(card);
});
recordRoutes.route("/flsahcardset").post(async function (req, res) {
  const setid = req.body.setid;
  const flashcardset = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(setid.toString())
  );
  const flashcardarray = flashcardset.flashcard;
  const map = new Map(Object.entries(flashcardarray));
  const array = Array.from(map.values());
  const sortedarray = insertionSort(array, array.length);
  const folderinfo = {
    flashcardset: flashcardset,
    flashcardarray: flashcardarray,
    sortedarray: sortedarray,
  };
  //console.log(sortedarray);
  res.json(folderinfo);
});
function insertionSort(arr, n) {
  let i, key, j;
  for (i = 1; i < n; i++) {
    key = arr[i];
    j = i - 1;
    while (j >= 0 && arr[j].difficulty < key.difficulty) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}
recordRoutes.route("/folder").post(async function (req, res) {
  const folderid = req.body.folderid;
  var folder = await Flashcarddata.GetFolderasync(
    client,
    ObjectId(folderid.toString())
  );
  folder.freq += 1;
  await Flashcarddata.UpdateFolder(
    client,
    ObjectId(folderid.toString()),
    folder
  );
  console.log(folder.freq);
  folder = await Flashcarddata.GetFolderasync(
    client,
    ObjectId(folderid.toString())
  );
  const user = await userdata.GetAsyncbyid(client, ObjectId(folder.owner));
  const foldermap = new Map(Object.entries(user.folder));
  foldermap.set(folder._id, folder);
  user.folder = Object.fromEntries(foldermap);
  await userdata.UpdateUser(client, ObjectId(folder.owner), user);
  res.json(folder);
});

recordRoutes.route("/loadspace").post(async function (req, res) {
  const userid = req.body.uid;
  const user = await userdata.GetAsyncbyid(client, ObjectId(userid));
  res.json(user);
});
recordRoutes.route("/search").post(async function (req, res) {
  const setname = req.body.setname;
  result = await Flashcarddata.searchSet(client, setname);
  res.json(result);
});
recordRoutes.route("/logout").post(async function (req, res) {
  res.json(false);
});
recordRoutes.route("/edit").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  const oldflashcard = await Flashcarddata.GetFlashcardasync(
    client,
    ObjectId(flashcardid)
  );
  oldflashcard.front = req.body.newfront;
  oldflashcard.back = req.body.newback;
  oldflashcard.difficulty = req.body.newDiff;
  result = await Flashcarddata.UpdateFlashcard(
    client,
    ObjectId(flashcardid),
    oldflashcard
  );
  belongset = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(oldflashcard.belongset)
  );
  const map = new Map(Object.entries(belongset.flashcard));
  map.set(flashcardid, oldflashcard);
  const mapobj = Object.fromEntries(map);
  belongset.flashcard = mapobj;
  result = await Flashcarddata.UpdateSet(
    client,
    ObjectId(belongset._id),
    belongset
  );
  res.json(true);
});
recordRoutes.route("/setpublic").post(async function (req, res) {
  const setid = req.body.status.id;
  const bool = req.body.status.shared;
  const set = await Flashcarddata.GetFlashcardsetasync(client, ObjectId(setid));
  if (bool == "false") {
    set.private = false;
    console.log("false");
  }
  if (bool == "true") {
    set.private = true;
    console.log("true");
  }
  await Flashcarddata.UpdateSet(client, ObjectId(setid), set);
  res.json(true);
});
recordRoutes.route("/editfolder").post(async function (req, res) {
  const folder = req.body.folder;
  const user = await userdata.GetAsyncbyid(client, ObjectId(folder.owner));
  const map = new Map(Object.entries(user.folder));
  map.set(folder._id, folder);
  //console.log(map.get(folder._id));
  const mapobj = Object.fromEntries(map);
  // console.log(mapobj);
  user.folder = mapobj;
  folder._id = ObjectId(folder._id);
  result = await Flashcarddata.UpdateFolder(
    client,
    ObjectId(folder._id),
    folder
  );
  await userdata.UpdateUser(client, ObjectId(user._id), user);
  res.json(true);
});
recordRoutes.route("/deletefolder").post(async function (req, res) {
  var folder = req.body.folder;
  //folder = await Flashcarddata.GetFolderasync(client,ObjectId(folder));
  var subjmap = await Flashcarddata.GetLabel(
    client,
    ObjectId("637287af2c8cf8c067cd2e58")
  );
  var setmap = new Map(Object.entries(subjmap.map));
  var foldermap = setmap;
  foldermap = foldermap.get(folder.label);
  foldermap = new Map(Object.entries(foldermap));
  foldermap.delete(folder._id.toString());
  setmap.set(folder.label, foldermap);
  console.log("foldermap.lengthis " + foldermap.length);
  if (foldermap.size == 0) {
    setmap.delete(folder.label);
    var changesubjectarray = await Flashcarddata.GetLabel(
      client,
      ObjectId("637287af2c8cf8c067cd2e59")
    );
    var changesubjectarraymap = new Map(Object.entries(changesubjectarray.Map));
    console.log("change subject is " + changesubjectarraymap);
    changesubjectarraymap.delete(folder.label);
    changesubjectarraymap = Object.fromEntries(changesubjectarraymap);
    changesubjectarray.Map = changesubjectarraymap;
    await Flashcarddata.UpdateLabel(
      client,
      ObjectId("637287af2c8cf8c067cd2e59"),
      changesubjectarray
    );
  }
  setmap = Object.fromEntries(setmap);
  subjmap.map = setmap;
  await Flashcarddata.UpdateLabel(
    client,
    ObjectId("637287af2c8cf8c067cd2e58"),
    subjmap
  );
  const user = await userdata.GetAsyncbyid(client, ObjectId(folder.owner));
  const map = new Map(Object.entries(user.folder));
  map.delete(folder._id);
  const mapobj = Object.fromEntries(map);
  user.folder = mapobj;
  folder._id = ObjectId(folder._id);
  result = await Flashcarddata.deleteFlashcardFolder(
    client,
    ObjectId(folder._id)
  );
  await userdata.UpdateUser(client, ObjectId(user._id), user);
  res.json(true);
});
recordRoutes.route("/groupcopy").post(async function (req, res) {
  const groups = req.body.groups;
  console.log(groups);
  const dest = req.body.dest;
  //console.log(groups[0].setid);
  const folder = await Flashcarddata.GetFolderasync(client, ObjectId(dest));
  for (i = 0; i < groups.length; i++) {
    const oldset = await Flashcarddata.GetFlashcardsetasync(
      client,
      ObjectId(groups[i].setid)
    );
    var flashcardarray = new Map(Object.entries(oldset.flashcard));
    flashcardarray = Array.from(flashcardarray.values());
    const newflashcardmap = new Map();
    const newset = oldset;
    delete newset._id;
    newset.belongfolder = dest;
    const result = await Flashcarddata.CreateSet(client, newset);
    const map = new Map(Object.entries(folder.flashcardset));
    map.set(
      result.insertedId,
      await Flashcarddata.GetFlashcardsetasync(client, result.insertedId)
    );
    const mapobj = Object.fromEntries(map);
    folder.flashcardset = mapobj;
    await Flashcarddata.UpdateFolder(client, ObjectId(dest), folder);
    const finalset = await Flashcarddata.GetFlashcardsetasync(
      client,
      result.insertedId
    );
    for (j = 0; j < flashcardarray.length; j++) {
      const newflashcard = flashcardarray[j];
      delete newflashcard._id;
      newflashcard.belongset = finalset._id;
      const result = await Flashcarddata.CreateFlashcard(client, newflashcard);
      newflashcardmap.set(
        result.insertedId,
        await Flashcarddata.GetFlashcardasync(client, result.insertedId)
      );
      const mapobj = Object.fromEntries(newflashcardmap);
      finalset.flashcard = mapobj;
      await Flashcarddata.UpdateSet(client, ObjectId(finalset._id), finalset);
    }
  }
  res.json(true);
});
recordRoutes.route("/copy").post(async function (req, res) {
  const groups = req.body.groups;
  const dest = req.body.dest;
  console.log(groups);
  console.log(dest);
  //console.log(groups[0].setid);
  const folder = await Flashcarddata.GetFolderasync(client, ObjectId(dest));
  const oldset = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(groups)
  );
  var flashcardarray = new Map(Object.entries(oldset.flashcard));
  flashcardarray = Array.from(flashcardarray.values());
  const newflashcardmap = new Map();
  const newset = oldset;
  delete newset._id;
  newset.belongfolder = dest;
  const result = await Flashcarddata.CreateSet(client, newset);
  const map = new Map(Object.entries(folder.flashcardset));
  map.set(
    result.insertedId,
    await Flashcarddata.GetFlashcardsetasync(client, result.insertedId)
  );
  const mapobj = Object.fromEntries(map);
  folder.flashcardset = mapobj;
  await Flashcarddata.UpdateFolder(client, ObjectId(dest), folder);
  const finalset = await Flashcarddata.GetFlashcardsetasync(
    client,
    result.insertedId
  );
  for (j = 0; j < flashcardarray.length; j++) {
    const newflashcard = flashcardarray[j];
    delete newflashcard._id;
    newflashcard.belongset = finalset._id;
    const result = await Flashcarddata.CreateFlashcard(client, newflashcard);
    newflashcardmap.set(
      result.insertedId,
      await Flashcarddata.GetFlashcardasync(client, result.insertedId)
    );
    const mapobj = Object.fromEntries(newflashcardmap);
    finalset.flashcard = mapobj;
    await Flashcarddata.UpdateSet(client, ObjectId(finalset._id), finalset);
  }
  res.json(true);
});
recordRoutes.route("/groupdelete").post(async function (req, res) {
  const groups = req.body.groups;
  var folder = req.body.folder;
  folder = await Flashcarddata.GetFolderasync(client, ObjectId(folder._id));
  for (i = 0; i < groups.length; i++) {
    await Flashcarddata.deleteSet(client, ObjectId(groups[i].setid));
    var map = new Map(Object.entries(folder.flashcardset));
    map.delete(groups[i].setid);
    console.log(map);
    folder.flashcardset = Object.fromEntries(map);
    await Flashcarddata.UpdateFolder(client, ObjectId(folder._id), folder);
  }
  res.json(true);
});
recordRoutes.route("/removeNote").post(async function (req, res) {
  const flashcardid = req.body.flashcardid;
  console.log(flashcardid);
  var flashcard = await Flashcarddata.GetFlashcardasync(
    client,
    ObjectId(flashcardid)
  );
  flashcard.image = "";
  console.log(flashcard);
  var set = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(flashcard.belongset)
  );
  var map = new Map(Object.entries(set.flashcard));
  map.set(flashcardid, flashcard);
  set.flashcard = Object.fromEntries(map);
  await Flashcarddata.UpdateSet(client, ObjectId(set._id), set);
  await Flashcarddata.UpdateFlashcard(client, ObjectId(flashcardid), flashcard);
  res.json(true);
});
recordRoutes.route("/verification").post(async function (req, res) {
  console.log(req.body.username);
  const user = await userdata.GetAsync(client, req.body.username);
  var val = Math.floor(1000 + Math.random() * 9000);
  console.log(user);
  var map = new Map(
    Object.entries(
      await userdata.Getverificationcode(
        client,
        ObjectId("637031a05d2937e578edddf2")
      )
    )
  );
  map.set(user._id, val);
  const obj = Object.fromEntries(map);
  console.log(obj);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "boilercard1@gmail.com",
      pass: "hwgprezcxqzkxexk",
    },
  });
  const mailOptions = {
    from: "boilercard1@gmail.com",
    to: user.email,
    subject: "Verification code",
    text:
      "Your code for recover password is: " +
      val +
      ", Do not send it to anyone.",
  };

  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
    } else {
      await userdata.Updateverification(
        client,
        ObjectId("637031a05d2937e578edddf2"),
        obj
      );
      console.log("Email sent: " + info.response);
    }
  });
  res.json(true);
});
recordRoutes.route("/report").post(async function (req, res) {
  var reportsetid = req.body.setid;
  var reportset = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(reportsetid)
  );
  reportset.private = true;
  reportset.flagged = true;
  await Flashcarddata.UpdateSet(client, ObjectId(reportsetid), reportset);
  res.json(true);
});
recordRoutes.route("/addlabel").post(async function (req, res) {
  var folder = await Flashcarddata.GetFolderasync(
    client,
    ObjectId(req.body.folderid)
  );
  var oldlabel = folder.label;
  var label = req.body.label;
  label = label.toLowerCase();
  folder.label = label;
  await Flashcarddata.UpdateFolder(client, ObjectId(folder._id), folder);
  var labelmap = await Flashcarddata.GetLabel(
    client,
    ObjectId("637287af2c8cf8c067cd2e58")
  );
  if (labelmap.map == null) {
    labelmap.map = new Map();
  } else {
    labelmap.map = new Map(Object.entries(labelmap.map));
  }
  var oldmap = labelmap.map.get(oldlabel);
  oldmap = new Map(Object.entries(oldmap));
  oldmap.delete(folder._id.toString());
  labelmap.map.set(oldlabel, oldmap);
  if (oldmap.size == 0) {
    labelmap.map.delete(oldlabel);
    var changesubjectarray = await Flashcarddata.GetLabel(
      client,
      ObjectId("637287af2c8cf8c067cd2e59")
    );
    var changesubjectarraymap = new Map(Object.entries(changesubjectarray.Map));
    changesubjectarraymap.delete(oldlabel);
    console.log(changesubjectarraymap);
    changesubjectarraymap = Object.fromEntries(changesubjectarraymap);
    changesubjectarray.Map = changesubjectarraymap;
    await Flashcarddata.UpdateLabel(
      client,
      ObjectId("637287af2c8cf8c067cd2e59"),
      changesubjectarray
    );
  }
  if (labelmap.map.get(label) == null) {
    const map = new Map();
    map.set(folder._id.toString(), folder._id);
    labelmap.map.set(label, map);
    const subjectarray = await Flashcarddata.GetLabel(
      client,
      ObjectId("637287af2c8cf8c067cd2e59")
    );
    if (subjectarray.Map == null) {
      subjectarray.Map = new Map();
    }
    subjectarray.Map = new Map(Object.entries(subjectarray.Map));
    subjectarray.Map.set(label, label);
    subjectarray.Map = Object.fromEntries(subjectarray.Map);
    await Flashcarddata.UpdateLabel(
      client,
      ObjectId("637287af2c8cf8c067cd2e59"),
      subjectarray
    );
  } else {
    const map = new Map(Object.entries(labelmap.map.get(label)));
    map.set(folder._id.toString(), folder._id);
    labelmap.map.set(label, map);
  }
  await Flashcarddata.UpdateLabel(
    client,
    ObjectId("637287af2c8cf8c067cd2e58"),
    labelmap
  );
  res.json(true);
});
recordRoutes.route("/subjectarray").get(async function (req, res) {
  const array = await Flashcarddata.GetLabel(
    client,
    ObjectId("637287af2c8cf8c067cd2e59")
  );
  const map = new Map(Object.entries(array.Map));
  const finalarray = Array.from(map.values());
  console.log("subject array is" + finalarray);
  res.json(finalarray);
});
recordRoutes.route("/searchsubject").post(async function (req, res) {
  const subject = req.body.subject;
  console.log("subject: " + subject);
  var labelmap = await Flashcarddata.GetLabel(
    client,
    ObjectId("637287af2c8cf8c067cd2e58")
  );
  labelmap = new Map(Object.entries(labelmap.map));
  var subjectarray = labelmap.get(subject);
  const resultarray = new Array();
  subjectarray = new Map(Object.entries(subjectarray));
  subjectarray = Array.from(subjectarray.values());
  for (var i = 0; i < subjectarray.length; i++) {
    var result = await Flashcarddata.GetFolderasync(
      client,
      ObjectId(subjectarray[i])
    );
    if (result != false) {
      var map = new Map(Object.entries(result.flashcardset));
      var newresult = Array.from(map.values());
      //console.log(newresult);
      for (var j = 0; j < newresult.length; j++) {
        var flashcardset = await Flashcarddata.GetFlashcardsetasync(
          client,
          ObjectId(newresult[j]._id)
        );
        if (flashcardset.private == false) {
          resultarray.push(flashcardset);
        }
      }
    }
  }
  console.log(resultarray);
  res.json(resultarray);
});
recordRoutes.route("/searchkeywords").post(async function (req, res) {
  var keyword = req.body.keyword;
  //console.log(keyword);
  //"Virtural memory"
  var myArray = keyword.split(",").map(function (item) {
    return item.trim();
  });
  myArray = myArray[0].split(" ");
  var resultmap = new Map();
  console.log(myArray);
  var folder;
  const initialsearch = await Flashcarddata.SearchSet(client, keyword);
  for (var j = 0; j < initialsearch.length; j++) {
    folder = await Flashcarddata.GetFolderasync(
      client,
      ObjectId(initialsearch[j].belongfolder)
    );
    console.log(folder);
    if (folder == false) {
      continue;
    } else if (initialsearch[j].private == false) {
      resultmap.set(initialsearch[j]._id.toString(), initialsearch[j]);
    }
  }
  for (var i = 0; i < myArray.length; i++) {
    var set = await Flashcarddata.SearchSet(client, myArray[i]);
    for (var j = 0; j < set.length; j++) {
      folder = await Flashcarddata.GetFolderasync(
        client,
        ObjectId(set[j].belongfolder)
      );
      if (folder == false) {
        continue;
      } else if (set[j].private == false) {
        resultmap.set(set[j]._id.toString(), set[j]);
      }
    }
  }
  const result = Array.from(resultmap.values());
  console.log(result);
  res.json(result);
});
recordRoutes.route("/groupmove").post(async function (req, res) {
  const groups = req.body.groups;
  var folder = req.body.folder;
  const dest = req.body.dest;
  const destfolder = await Flashcarddata.GetFolderasync(client, ObjectId(dest));
  folder = await Flashcarddata.GetFolderasync(client, ObjectId(folder._id));
  for (i = 0; i < groups.length; i++) {
    var map = new Map(Object.entries(folder.flashcardset));
    map.delete(groups[i].setid);
    console.log(map);
    folder.flashcardset = Object.fromEntries(map);
    await Flashcarddata.UpdateFolder(client, ObjectId(folder._id), folder);
    var set = await Flashcarddata.GetFlashcardsetasync(
      client,
      ObjectId(groups[i].setid)
    );
    set.belongfolder = dest;
    await Flashcarddata.UpdateSet(client, ObjectId(set._id), set);
    var destmap = new Map(Object.entries(destfolder.flashcardset));
    destmap.set(set._id, set);
    destfolder.flashcardset = Object.fromEntries(destmap);
    await Flashcarddata.UpdateFolder(client, ObjectId(dest), destfolder);
  }
  res.json(true);
});
recordRoutes.route("/forgotpassword").post(async function (req, res) {
  const username = req.body.username;
  console.log("username:" + username);
  const code = req.body.code;
  console.log(code);
  const user = await userdata.GetAsync(client, username);
  const password = user.password;
  const codemap = new Map(
    Object.entries(
      await userdata.Getverificationcode(
        client,
        ObjectId("637031a05d2937e578edddf2")
      )
    )
  );
  const realcode = codemap.get(user._id.toString());
  if (code == realcode) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "boilercard1@gmail.com",
        pass: "hwgprezcxqzkxexk",
      },
    });
    const mailOptions = {
      from: "boilercard1@gmail.com",
      to: user.email,
      subject: "Your password",
      text: "Your old password is: " + password + ", Do not send it to anyone.",
    };
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.json(true);
  } else {
    res.json(false);
  }
});

recordRoutes.route("/createTeacher").post(async function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;
  if ((await userdata.GetTeacher(client, userName)) != false) {
    console.log("username exist");
    res.json(false);
    return;
  }
  const account = new teacherAccount(userName, password);
  await userdata.createTeacherAccount(client, account);
  res.json(true);
});
recordRoutes.route("/teacherSignIn").post(async function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;
  const result = await userdata.GetTeacher(client, userName);
  if (result != false) {
    if (result.password == password) {
      res.json(result);
      return;
    }
  }
  res.json(false);
});
const { Class } = require("../db/Flashcard/Model/Class.js");
const { resolveObjectURL } = require("buffer");
recordRoutes.route("/createClass").post(async function (req, res) {
  const teacher = req.body.userName;
  const className = req.body.className;
  var val = Math.floor(1000 + Math.random() * 9000);
  console.log(val);
  const newClass = new Class(className, teacher, val);
  const teacherAccount = await userdata.GetTeacher(client, teacher);
  teacherAccount.class.push(newClass);
  await userdata.UpdateTeacher(client, teacher, teacherAccount);
  await userdata.AddClass(client, newClass);
  res.json(true);
});
var NumberInt = require("mongodb").Int32;
recordRoutes.route("/Class").post(async function (req, res) {
  const classCode = req.body.classCode;
  console.log(classCode);
  const result = await userdata.GetClass(client, NumberInt(classCode));
  if (result != false) {
    res.json(result);
  } else {
    res.json(false);
  }
});
recordRoutes.route("/joinClass").post(async function (req, res) {
  const userID = req.body.userID;
  const userInfo = await userdata.GetAsyncbyid(client, ObjectId(userID));
  console.log(userInfo);
  const userName = userInfo.username;
  const classCode = req.body.classCode;
  const result = await userdata.GetClass(client, NumberInt(classCode));
  if (result != false) {
    console.log(result.student);
    const studentMap = new Map(Object.entries(result.student));
    if (studentMap.get(userName) == null) {
      studentMap.set(userName, userName);
      result.student = studentMap;
      console.log(result);
      const classMap = new Map(Object.entries(userInfo.class));
      await userdata.UpdateClass(client, NumberInt(classCode), result);
      classMap.set(result._id, result);
      userInfo.class = Object.fromEntries(classMap);
      await userdata.UpdateUser(client, ObjectId(userID), userInfo);
      res.json(true);
    } else {
      res.json(false);
    }
  } else {
    res.json(false);
  }
});
recordRoutes.route("/storeScore").post(async function (req, res) {
  const userID = req.body.userID;
  const userInfo = await userdata.GetAsyncbyid(client, ObjectId(userID));
  const userName = userInfo.username;
  var score = req.body.score;
  var time = req.body.time;
  score = NumberInt(score);
  time = Number(time);
  scoreResult = {
    userName: userName,
    score: score,
    time: time,
  };
  console.log(score.value);
  const setID = req.body.setID;
  const result = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(setID)
  );
  if (result != false) {
    const scoremap = new Map(Object.entries(result.score));
    //console.log(scoremap);
    if (scoremap.get(userName) == null) {
      scoremap.set(userName, scoreResult);
      console.log(scoremap);
    } else {
      if (NumberInt(scoremap.get(userName).score) < score) {
        scoremap.set(userName, scoreResult);
      }
      if (
        NumberInt(scoremap.get(userName).score) == score &&
        NumberInt(scoremap.get(userName).time) > time
      ) {
        scoremap.set(userName, scoreResult);
      }
    }
    result.student = scoremap;
    await Flashcarddata.UpdateSet(client, ObjectId(setID), result);
    res.json(true);
  } else {
    res.json(false);
  }
});
function boardSort1(arr, n) {
  let i, key, j;
  for (i = 1; i < n; i++) {
    key = arr[i];
    j = i - 1;
    while (j >= 0) {
      if (arr[j].score < key.score) {
        arr[j + 1] = arr[j];
        j = j - 1;
      } else if (arr[j].score == key.score && arr[j].time > key.time) {
        arr[j + 1] = arr[j];
        j = j - 1;
      }
    }

    arr[j + 1] = key;
  }
  return arr;
}
recordRoutes.route("/getLeaderboard").post(async function (req, res) {
  const setID = req.body.setID;
  const getLeaderboard = new Array();
  const result = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(setID)
  );
  if (result != false) {
    var score = new Map(Object.entries(result.student));
    console.log(score);
    score = Array.from(score.values());
    const sortedarray = boardSort1(score, score.length);
    console.log(sortedarray);
    res.json(sortedarray);
  } else {
    res.json(false);
  }
});

recordRoutes.route("/leaveClass").post(async function (req, res) {
  const userID = req.body.userID;
  const user = await userdata.GetAsyncbyid(client, userID);
  const classCode = NumberInt(req.body.classCode);
  const Class = await userdata.GetClass(client, classCode);
  const studentMap = new Map(Object.entries(Class.student));
  studentMap.delete(user.username);
  Class.student = Object.fromEntries(studentMap);
  await userdata.UpdateClass(client, classCode, Class);
  const classMap = new Map(Object.entries(user.class));
  classMap.delete(Class._id);
  user.class = Object.fromEntries(classMap);
  await userdata.UpdateUser(client, classCode, user);
  res.json(true);
});
recordRoutes.route("/deleteClass").post(async function (req, res) {
  const classCode = NumberInt(req.body.classCode);
  const Class = await userdata.GetClass(client, classCode);
  const teacherName = Class.teacher;
  const teacher = await userdata.GetTeacher(client, teacherName);
  const classArray = teacher.class;
  for (let i = 0; i < classArray.length; i++) {
    if (classArray[i].classCode == classCode) {
      classArray.splice(i, 1);
    }
  }
  teacher.class = classArray;
  await userdata.UpdateTeacher(client, teacherName, teacher);
  await userdata.deleteClass(client, classCode);
  res.json(true);
});
recordRoutes.route("/send").post(async function (req, res) {
  const setID = req.body.setID;
  const userName = req.body.userName;
  const user = await userdata.GetAsync(client, userName);
  if (user != false) {
    var set = await Flashcarddata.GetFlashcardsetasync(client, ObjectId(setID));
    delete set._id;
    const folder = await Flashcarddata.GetFolderasync(
      client,
      ObjectId(user.defaultfolder)
    );
    console.log("nice");
    if (folder != false) {
      set.belongfolder = folder._id;
      const result = await Flashcarddata.CreateSet(client, set);
      var flashcardSetMap = new Map(Object.entries(folder.flashcardset));
      flashcardSetMap.set(result._id, result);
      flashcardSetMap = Object.fromEntries(flashcardSetMap);
      folder.flashcardset = flashcardSetMap;
      await Flashcarddata.UpdateFolder(client, folder._id, folder);
    } else {
      const newFolder = new Folder("copyFolder", user._id);
      const folderResult = await Flashcarddata.Createfolder(client, newFolder);
      set.belongfolder = folderResult._id;
      const result = await Flashcarddata.CreateSet(client, set);
      var flashcardSetMap = new Map(Object.entries(folderResult.flashcardset));
      flashcardSetMap.set(result._id, result);
      flashcardSetMap = Object.fromEntries(flashcardSetMap);
      folderResult.flashcardset = flashcardSetMap;
      await Flashcarddata.UpdateFolder(client, folderResult._id, folder);
      var folderMap = new Map(Object.entries(user.folder));
      folderMap.set(folderResult._id, folderResult);
      folderMap = Object.fromEntries(folderMap);
      user.folder = folderMap;
      await userdata.UpdateUser(client, user._id, user);
    }
    res.json(true);
  } else {
    res.json(false);
  }
});
recordRoutes.route("/getScoreList").post(async function (req, res) {
  const setID = req.body.setID;
  const classCode = req.body.classCode;
  const Class = await userdata.GetClass(client, NumberInt(classCode));
  const setInfo = await Flashcarddata.GetFlashcardsetasync(
    client,
    ObjectId(setID)
  );
  var studentList = new Map(Object.entries(Class.student));
  var scoreMap = new Map(Object.entries(setInfo.student));
  console.log(studentList);
  console.log(scoreMap);
  const finalarray = new Array();
  studentList = Array.from(studentList.values());
  for (var i = 0; i < studentList.length; i++) {
    if (scoreMap.get(studentList[i]) == null) {
      finalarray.push({
        name: studentList[i],
        score: null,
      });
    } else {
      finalarray.push({
        name: studentList[i],
        score: scoreMap.get(studentList[i]),
      });
    }
  }
  res.json(finalarray);
});
recordRoutes.route("/getTeacherSpace").post(async function (req, res) {
  const userName = req.body.userName;
  const teacher = await userdata.GetTeacher(client, userName);
  res.json(teacher);
});
recordRoutes.route("/createTeacherSet").post(async function (req, res) {
  const list = req.body.inputList;
  //null statement check
  const setname = req.body.name;
  const belongclassCode = NumberInt(req.body.classCode);
  const newset = new Flashcardset(setname);
  newset.private = true;
  //console.log(newset.private);
  newset.belongfolder = belongclassCode;
  const set = await Flashcarddata.CreateSet(client, newset);
  const belongClass = await userdata.GetClass(client, belongclassCode);
  const myObjectId = set.insertedId;
  const flashcardSetArray = belongClass.flashcardset;
  flashcardSetArray.push(set);
  belongClass.flashcardset = flashcardSetArray;
  await userdata.UpdateClass(client, belongclassCode, belongClass);
  for (var i = 0; i < list.length; i++) {
    await createFlashcard(
      list[i].front,
      list[i].back,
      myObjectId.toString(),
      list[i].drate,
      list[i].img
    );
  }
  res.json(true);
});
module.exports = recordRoutes;
