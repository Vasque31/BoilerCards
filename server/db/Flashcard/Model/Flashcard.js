class Flashcard{ 
    
    constructor(front,back,belongsetid) {
        this.front = front;
        this.back = back;
        this.flagged = false;
        this.belongset = belongsetid;
    }
   
}
exports.Flashcard = Flashcard; 