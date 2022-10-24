class Folder{ 
    
    constructor(foldername,owner) {
        this.owner = owner;
        this.foldername = foldername;
        this.private = true;
        this.flashcardset = new Map();
        this.timespent = new Array();
    }
   
}
exports.Folder = Folder;