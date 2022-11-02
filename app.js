
import fs from "fs";
import express from "express";
import multer from "multer";
import axios from 'axios';
var app = express();
var upload = multer({ dest: 'upload/' });
import { MongoClient } from 'mongodb';
const BSON = import ("bson");
import imgbbUploader from "imgbb-uploader";
const uri = "mongodb+srv://wang4633:Wwq010817@cluster0.asirh9k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
app.post('/upload', upload.single('logo'), async function(req, res, next){
    var file = req.file;
    console.log(file.mimetype);
    console.log(file.originalname);
    console.log(file.size);
    console.log(file.path);
    res.send({ret_code: '0'});
    const userData = {
        username: 'wang4633',
        //avatar: fs.readFileSync("./upload/8fc88f8aacab63f44201e5312d041d0d"),
        avatar: fs.readFileSync("./upload/"+file.filename),
    }
    imgbbUploader("72248618eddd9ac14a512e2864ab056c", "./upload/"+file.filename)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
    
    //const data = (await BSON).deserialize(data1);
    await AddLogAsync(client,userData)
});
async function AddLogAsync(client, file) {
    const result = await client
      .db("Flashcard")
      .collection("Images")
      .insertOne(file);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
}
app.get('/form', function(req, res, next){
    var form = fs.readFileSync('./form.html', {encoding: 'utf8'});
    res.send(form);
});
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}
var PORT = 4000;
 
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})