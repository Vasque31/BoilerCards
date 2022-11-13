class Folder{ 
    
    constructor(foldername,owner) {
        this.owner = owner;
        this.foldername = foldername;
        this.flashcardset = new Map();
        this.timespent = new Map();
        this.label = null;
    }
   
}
exports.Folder = Folder;