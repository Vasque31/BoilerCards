class Flashcardset{ 
    
    constructor(setname) {
        this.setname = setname;
        this.flashcard = new Map();
        this.belongfolder = null;
        this.private = true;
    }

}
exports.Flashcardset = Flashcardset;