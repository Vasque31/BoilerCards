class Flashcard{ 
    
    constructor(front,back,belongsetid) {
        this.front = front;
        this.back = back;
        this.flagged = false;
        this.belongset = belongsetid;
        this.difficulty = 3;
        this.image = null;
    }
   
}
exports.Flashcard = Flashcard; 