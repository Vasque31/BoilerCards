import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect } from "react";

import axios from "axios";

import "./Leaderboard.css";
import { getCookie } from "react-use-cookie";

function StudentGrade() {
    const navigate = useNavigate();
    const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('class')));
    const [studentSelected, setStudentSelected] = useState(getCookie('selectedStudent'));


    const handleReturn = () => {
        navigate(-1);
    }

    function timeToDisplay(time) {
        if (time == -1) return (<div>Incomplete</div>);
        return(<div>{(time - (time % 100))/100}.{(time % 100)/10}sec</div>);
    }

    //get object with key, Work around for ".get not a function"
    function getObjWithKey(map, key) {
        var arr = Object.values(map);
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == key) return arr[i];
        }
        return {};
    }

//library = class
//student = a username of a selected student
return(
<div>
    <div className="scores-board">
        <div className="scores-container" class='flex-container'>
        {library.flashcardset.map((item) => {
            console.log(item);
            console.log(item.student);
            console.log(studentSelected);
            var obj = getObjWithKey(item.student, studentSelected);
            if (obj.score != null && obj.time != null) {
                return (
                    <div className="student-listing">
                        <p className="user-header"> {item.setname}</p>
                            <h2 className="user-scoreinfo"> Score: {obj.score}</h2>
                            <h3 className="user-scoreinfo"> Time: {timeToDisplay(obj.time)}</h3>
                    </div>
                );
            } else {
                return(
                <div className="sudent-listing">
                    <p className="user-header"> {item.setname}</p>
                        <h2 className="user-scoreinfo"> Incomplete </h2>
                </div>
                );
            }


        })}
        </div>
    </div>
    <Button className='abort' onClick={handleReturn}>Exit</Button>
</div>

    
);
}

export default StudentGrade;