

function getFolders(uid) {
	 let res = await axios.post("http://localhost:5000/signin", {
          uid,
        });
        let foldersarray = res.data;
	  return folderarray;
}

function getFolder(folderid) {
	 let res = await axios.post("http://localhost:5000/signin", {
          folderid,
        });
        let folderObject = res.data;
	  return folderObject;
}

function getFlashcardSet(flashcardsetid) {
	 let res = await axios.post("http://localhost:5000/signin", {
          flashcardsetid,
        });
        let flashcardsetObject = res.data;
	  return flashcardsetObject;
}

function getFlashcard(flashcardid) {
	 let res = await axios.post("http://localhost:5000/signin", {
          flashcardid,
        });
        let folderObject = res.data;
	  return folderObject;

}