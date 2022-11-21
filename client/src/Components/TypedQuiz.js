import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { cardsQuiz } from "./ViewFlashcard";
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import {CloseButton} from 'react';

import * as React from 'react';
import "./QuizGame.css";


var score = 0;
var previousCorrectPrompts = [];
var previousIncorrectPrompts = [];

var currPrompt = 0;
var promptNeedSelected = true;

var timerToStart = true;
var timerToStop = false;
var globalTime = 0; // hundreth's of a second
var globalScopeClock = null;

function TypedQuiz()  {

    var mode = "All prompts once"
    const [correctness, setCorrectness] = useState("Correct");
    const navigate = useNavigate();
    const [showContinueorExit, setShowContinueorExit] = useState(false);
    const [showQuestionFeedback, setShowQuestionFeedback] = useState(false);
    const [answer, setAnswer] = useState("");
    const [time, setTime] = useState(0); // hundreth's of a second

    React.useEffect(() => {
        var clockInterval;
        if (timerToStart) {
            timerToStart = false;
            timerToStop = false;
            globalTime = 0;
            clockInterval = setInterval(() => {
                globalTime += 20;
                setTime(globalTime);
            }, 200);
            
            globalScopeClock = clockInterval;
        }
        


    }, [])
    
    

    /*****************************************************
     *      Handlers                                     *
     *                                                   *
     ****************************************************/
     const handleNextQuestion = () => {
        promptNeedSelected = true;
        setShowQuestionFeedback(false);
    }

    const handleTypedAnswer = () => {
        console.log("Answer: " + answer + "Expected: " + cardsQuiz[currPrompt].back);

        var correct;
        if (cardsQuiz[currPrompt].back == answer) {
            correct = true;
        } else {
            correct = false;
        }

        if (correct == true) {
            score++;
            previousCorrectPrompts.push(currPrompt);
            setCorrectness("✅Correct\n");

        } else {
            score--;
            previousIncorrectPrompts.push(currPrompt);
            setCorrectness("⛔️Incorrect\n");
        }

        setShowQuestionFeedback(true);
    }

    const handleShowExitQuiz = () => {
        setShowContinueorExit(true);
    }

    const handleHideExit = () => {
        setShowContinueorExit(false);
    }

    const handleExitQuiz = () => {
        /*let res = await axios.post("http://localhost:3001/bestscore",{
            uid: getCookie('u_id'),
            setid: cardsQuiz[0].belongset
            score: score,
        });*/
        //returns {BestScore: value, NewBestScore: true/false}
        console.log("correct: " + previousCorrectPrompts);
        console.log("incorrect: " + previousIncorrectPrompts); 
    
            //reset values
        previousCorrectPrompts = [];
        previousIncorrectPrompts = [];
        score = 0;
        globalTime = 0;
        clearInterval(globalScopeClock); 
        setShowContinueorExit(false);
        timerToStart = true;
        navigate(-1);

    }
        /****************************************************
         *      Core    Logic                               *
         *                                                  *
         ****************************************************/

    if (promptNeedSelected == true) {

        var selectedPromptIndex = 0;
        
            selectedPromptIndex = randomCard(previousCorrectPrompts.concat(previousIncorrectPrompts));
            if (selectedPromptIndex < 0 || selectedPromptIndex >= cardsQuiz.length) {
                console.log("Out of bounds index");
                selectedPromptIndex = 0; //avoid crash/err
            }
            //console.log("length of exclusion" + );
            if (previousCorrectPrompts.concat(previousIncorrectPrompts).length >= cardsQuiz.length) {
                setShowContinueorExit(true);
                handleExitQuiz();
            }
        
        currPrompt = selectedPromptIndex;
        promptNeedSelected = false; //wait till answer to select new prompt
    }



    return(
        <div>
            <Button onClick={handleShowExitQuiz}> Exit Quiz </Button>

            
            <h1 style={{textAlign: "right", color: "gold"}}> Timer: </h1>
            <h1 style={{textAlign: "right", color: "gold"}}>  {(time - (time % 100))/100}.{(time % 100)/10}sec </h1>

            
            <h1 style={{textAlign: "center", color: "gold"}}> Prompt: </h1>
            <br></br>
            <h1 style={{textAlign: "center", color: "gold"}}> {cardsQuiz[currPrompt].front}</h1>
            <br></br>
            <h1 style={{textAlign: "center", color: "gold"}}> Answer:</h1>
            <br></br>
            <textarea type="text" name="answer" onChange={e => setAnswer(e.target.value)}></textarea>
            <Button onClick={handleTypedAnswer}>Submit Answer</Button>

            <Modal show={showContinueorExit} onHide={() => handleHideExit}>
                <Modal.Header>
                    <Modal.Title> Exit Quiz? </Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    <h1>{correctness}</h1>       
                    <br></br>
                    <h1>Score: {score}</h1>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleHideExit()}> Continue </Button>
                    <Button onClick={() => handleExitQuiz()}> Exit Quiz </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showQuestionFeedback} onHide={() => handleNextQuestion()}>
                <Modal.Header>
                    <Modal.Title> Question Feedback </Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    <h1>{correctness}</h1>      
                    <br></br> 
                    <h1>Score: {score}</h1>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleNextQuestion()}> Next Question </Button>
                </Modal.Footer>
            </Modal>


        </div>
    );
}


//check if value is in array
function includes(array, value) {
    //console.log("inclusion check" + array + ",  " + value)
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) return true;
    }
    //console.log("includes - false");
    return false;
}

//returns index of a card within cardsQuiz
function randomCard(excludedIndices) {
    if (excludedIndices == null) {
        //console.log("no exclusion")
        var index = -1;
        index = Math.random() * cardsQuiz.length;
        if (index == cardsQuiz.length) index = cardsQuiz.length - 1;
        index = Math.floor(index);
        return index;
    }
    var index = -1;
    while (true) {
        //Attempts to get unused indices limitted, used to prevent infinite loops
        //console.log("exclusion present")
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