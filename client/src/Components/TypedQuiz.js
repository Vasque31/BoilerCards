import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { cardsQuiz } from "./ViewFlashcard";
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import {CloseButton} from 'react';

import * as React from 'react';
import ReactStopwatch from 'react-stopwatch';
import "./QuizGame.css";

var score = 0;
var previousCorrectPrompts = [];
var previousIncorrectPrompts = [];

function TypedQuiz()  {


    var selectedPromptIndex = randomCard();


    return(
        <div>

            
            <h1 style={{textAlign: "center", color: "gold"}}> Prompt: </h1>
            <br></br>
            <h1 style={{textAlign: "center", color: "gold"}}> {cardsQuiz[selectedPromptIndex].front}</h1>
            <br></br>
            <h1 style={{textAlign: "center", color: "gold"}}> Answer Choices:</h1>
            <br></br>




        </div>
    );
}


//check if value is in array
function includes(array, value) {
    console.log("inclusion check" + array + ",  " + value)
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) return true;
    }
    console.log("includes - false");
    return false;
}

//returns index of a card within cardsQuiz
function randomCard(excludedIndices) {
    if (excludedIndices == null) {
        console.log("no exclusion")
        var index = -1;
        index = Math.random() * cardsQuiz.length;
        if (index == cardsQuiz.length) index = cardsQuiz.length - 1;
        index = Math.floor(index);
        return index;
    }
    var index = -1;
    while (true) {
        //Attempts to get unused indices limitted, used to prevent infinite loops
        console.log("exclusion present")
        var attempts = 100;
        var i = 0;
        for (i=0; i < attempts; i++) {
            index = Math.random() * cardsQuiz.length;
            if (index == cardsQuiz.length) index = cardsQuiz.length - 1;
            index = Math.floor(index);
            if (includes(excludedIndices, index) == false) {
                console.log("returning index:" + index);
                return index;
            }
        }
        return -1;
    }
}

//returns an array of 3 indices
//place array of correct index to exclude it from options
//Purpose: ensure non-duplicate indexed options
function randomIncorrectArray(excludedIndices) {
    var incorrectArray = [];
    if (excludedIndices == null) excludedIndices = []; //ensure no null errors
    incorrectArray.push(randomCard(excludedIndices));
    incorrectArray.push(randomCard(incorrectArray.concat(excludedIndices)));
    incorrectArray.push(randomCard(incorrectArray.concat(excludedIndices)));
    return incorrectArray;
}

export default TypedQuiz;