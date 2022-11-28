class Flashcardset {
  constructor(setname) {
    this.setname = setname;
    this.flashcard = new Map();
    this.belongfolder = null;
    this.private = true;
    this.flagged = false;
    this.score = new Map();
  }
}
exports.Flashcardset = Flashcardset;
