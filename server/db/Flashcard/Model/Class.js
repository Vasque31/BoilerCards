class Class {
  constructor(className, teacher, classCode) {
    this.className = className;
    this.classCode = classCode;
    this.teacher = teacher;
    this.student = new Map();
    this.flashcardset = new Array();
  }
}
exports.Class = Class;
