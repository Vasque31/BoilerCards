import axios from "axios";


function getFolders(uid) {
	 let res = await axios.post("http://localhost:5000/signin", {
          uid,
        });
        let foldersarray = res.data;
	  return folderarray;
}

function getFolder(folderid) {
	 let res = await axios.post("http://localhost:5000/folder", {
          folderid,
        });
        let folderObject = res.data;
	  return folderObject;
}

function getFlashcardSet(flashcardsetid) {
	 let res = await axios.post("http://localhost:5000/flsahcardset", {
          flashcardsetid,
        });
        let flashcardsetObject = res.data;
	  return flashcardsetObject;
}

function getFlashcard(flashcardid) {
	 let res = await axios.post("http://localhost:5000/flsahcard", {
          flashcardid,
        });
        let folderObject = res.data;
	  return folderObject;

}

