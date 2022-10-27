class Flashcardset{ 
    
    constructor(setname) {
        this.setname = setname;
        this.flashcard = new Map();
        this.belongfolder = null;
    }

}
exports.Flashcardset = Flashcardset;