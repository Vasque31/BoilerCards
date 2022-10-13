import { MongoClient } from 'mongodb';
import { Flashcardset } from './Model/Flashcardset.js';
import { Folder } from './Model/Folder.js';
import {FlascardDBService} from './Service/Iflashcard.js';
import {ObjectId} from 'mongodb'; 
import { Flashcard } from './Model/Flashcard.js';
const uri = "mongodb+srv://wang4633:Wwq010817@cluster0.asirh9k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const Flashcarddata = new  FlascardDBService();
async function createfolder(){
    const foldername = "CS307";
    const uid = "uifdhh894";
    const newfolder = new Folder(foldername,uid);
    await Flashcarddata.Createfolder(client,newfolder);
    
}
async function createflashcardset(){
    const setname = "unit1";
    const newset = new Flashcardset(setname);
    newset.belongfolder = "6337ad388b6d9e7c9f240cb4";
    const set = await Flashcarddata.CreateSet(client,newset);
    const belongfolder = await Flashcarddata.GetFolderasync(client,ObjectId("6337ad388b6d9e7c9f240cb4"));
    const json = JSON.stringify(belongfolder);
    const obj = JSON.parse(json);
    const array = obj.flashcardset;
    const myObjectId = ObjectId(set.insertedId);
    array.push(myObjectId.toString());
    belongfolder.flashcardset = array;
    Flashcarddata.UpdateFolder(client,ObjectId("6337ad388b6d9e7c9f240cb4"),belongfolder);
}
async function createFlashcard(){
    const front = "CS307";
    const back = "uifdhh894";
    const newflashcard = new Flashcard(front,back);
    newflashcard.belongset = "6337ae3270d8b3399d444537";
    const belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId("6337ae3270d8b3399d444537"));
    const card = await Flashcarddata.CreateFlashcard(client,newflashcard);
    const json = JSON.stringify(belongset);
    const obj = JSON.parse(json);
    const array = obj.flashcard;
    const myObjectId = ObjectId(card.insertedId);
    array.push(myObjectId.toString());
    belongset.flashcard = array;
    Flashcarddata.UpdateSet(client,ObjectId("6337ae3270d8b3399d444537"),belongset);
}
async function deletFlashcard(){
    const card = await Flashcarddata.GetFlashcardasync(client,ObjectId("63388576a834562b3dd3a3ee"));
    if (card){
        const belongset = await Flashcarddata.GetFlashcardsetasync(client,ObjectId(card.belongset));
        const json = JSON.stringify(belongset);
        const obj1 = JSON.parse(json);
        const obj = obj1.flashcard;
        for( var i = 0; i < obj.length; i++){                                 
            if ( obj[i] === "63388576a834562b3dd3a3ee") { 
                obj.splice(i, 1); 
                break;
            }
        }
        belongset.flashcard = obj;
        Flashcarddata.UpdateSet(client,ObjectId("6337ae3270d8b3399d444537"),belongset);
    }
   
    await Flashcarddata.deleteFlashcard(client,ObjectId("63388576a834562b3dd3a3ee"));
}

async function deleteSet(){
    const set = await Flashcarddata.GetFlashcardsetasync(client,ObjectId("633887ac34765a8fc95c502e"));
    if (set){
        const belongfolder = await Flashcarddata.GetFolderasync(client,ObjectId(set.belongfolder));
        const json = JSON.stringify(belongfolder);
        const obj1 = JSON.parse(json);
        const obj = obj1.flashcardset;
        for( var i = 0; i < obj.length; i++){                                 
            if ( obj[i] === "633887ac34765a8fc95c502e") { 
                obj.splice(i, 1); 
                break;
            }
        }
        belongfolder.flashcardset = obj;
        Flashcarddata.UpdateFolder(client,belongfolder._id,belongfolder);
    }
    await Flashcarddata.deleteSet(client,ObjectId("633887ac34765a8fc95c502e"));
}
deleteSet();