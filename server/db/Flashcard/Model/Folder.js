class Folder{ 
    
    constructor(foldername,owner) {
        this.owner = owner;
        this.foldername = foldername;

        this.flashcardset = new Map();
        this.timespent = new Map();
    }
   
}
exports.Folder = Folder;