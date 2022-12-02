import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect } from "react";

import axios from "axios";

import "./Leaderboard.css";
import { getCookie } from "react-use-cookie";

function StudentGrade() {
  const navigate = useNavigate();
  const studentList = JSON.parse(localStorage.getItem("studentList"));
  console.log(studentList);
  const [studentSelected, setStudentSelected] = useState(
    getCookie("selectedStudent")
  );
  var time = 0;
  var score = 0;
  for (var i = 0; i < studentList.length; i++) {
    if (studentSelected === studentList[i].name) {
      console.log("yes");
      console.log(studentList[i]);
      if (studentList[i].score != null) {
        time = timeToDisplay(studentList[i].score.time);
        score = studentList[i].score.score;
      } else {
        time = timeToDisplay(0);
        score = "incomplete";
      }
    }
  }
  const handleReturn = () => {
    navigate(-1);
  };

  function timeToDisplay(time) {
    if (time == -1) return <div>Incomplete</div>;
    return (time - (time % 100)) / 100 + "." + (time % 100) / 10;
  }

  //get object with key, Work around for ".get not a function"

  //library = class
  //student = a username of a selected student
  return (
    <div>
      <div className="scores-board">
        <div className="scores-container" class="flex-container"></div>
      </div>
      <Button className="abort" onClick={handleReturn}>
        Exit
      </Button>
    </div>
  );
}

export default StudentGrade;
