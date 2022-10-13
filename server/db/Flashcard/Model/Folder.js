class Folder{ 
    
    constructor(foldername,owner) {
        this.owner = owner;
        this.foldername = foldername;
        this.private = true;
        this.flashcardset = new Array();
        this.timespent = new Array();
        this.folder = new Array();
    }
   
}
exports.Folder = Folder;