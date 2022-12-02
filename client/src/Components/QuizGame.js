import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import {CloseButton} from 'react';
//import {cardsQuiz} from "./ViewFlashcard.js"

import * as React from 'react';
import "./QuizGame.css";
import axios from 'axios';
import { getCookie } from 'react-use-cookie';

var flashcardarray;
var score = 0;
var previousCorrectPrompts = [];
var previousIncorrectPrompts = [];

var readyForNewQuestion = true;
var currPrompt = 0;
var currQuestion = [{Index: 0, Correct:true},{Index: 0, Correct:true},{Index: 0, Correct:true},{Index: 0, Correct:true}];

var timerToStart = true;
var timerToStop = false;
var globalScopeClock = null;

var globalTime = 0; // 1/100th seconds
var earlyExit = false;
//var cardsQuiz = {front: 'a', back: 'b'};

var quizLength = -1;
//Assume new round onHide for now

function QuizGame() {
    console.log("Rendering Quiz Game")
    //flashcardarray = cardsQuiz;
        /****************************************************
         *      Const definitions: states                   *
         *                                                  *
         ****************************************************/    
    const [correctness, setCorrectness] = useState("Correct");
    const navigate = useNavigate();
    const [showContinueorExit, setShowContinueorExit] = useState(false);
    const [showQuestionFeedback, setShowQuestionFeedback] = useState(false);
    const [showAbortQuiz, setShowAbortQuiz] = useState(false);
    const [time, setTime] = useState(0); // 1/100th seconds
    const [flashcardsetinfo, setFlashcardsetinfo] = useState(JSON.parse(localStorage.getItem('flashcards')));
    const [cardsQuiz, setCardsQuiz] = useState(Object.values(flashcardsetinfo.flashcardarray));
    console.log("quiz src, load local storage");
    console.log(cardsQuiz);
    //cardsQuiz = cardsQuizSrc
    var mode = "All prompts once";
    quizLength = cardsQuiz.length;    

    React.useEffect(() => {
        
        var clockInterval;

        if (timerToStart) {
            globalTime = 0;
            timerToStart = false;
            timerToStop = false;
            console.log("Run clock speed")
            clockInterval = setInterval(() => {
                globalTime += 20;
                setTime(globalTime);
            }, 200);
            globalScopeClock = clockInterval; // access thru global scope
        }

    }, [])
        /****************************************************
         *      Handlers                                   *
         *                                                  *
         ****************************************************/

        //quiz taking
    const handleSelectCorrectAnswer = () => {
        score++;
        setCorrectness("✅Correct\n");
        previousCorrectPrompts.push(currPrompt);
        setShowQuestionFeedback(true);
    }
    const handleSelectIncorrectAnswer = () => {
        score--;
        setCorrectness("⛔️Incorrect\n");
        previousIncorrectPrompts.push(currPrompt);
        setShowQuestionFeedback(true);
    }
    
    const handleNextQuestion = () => {
        readyForNewQuestion = true;
        setShowQuestionFeedback(false);
    }

    //premature exit
    const handleShowAbortQuiz = () => {
        setShowAbortQuiz(true);
    }

    const handleHideAbortQuiz = () => {
        setShowAbortQuiz(false);
    }

    const handleAbortQuiz = () => {
        earlyExit = true;
        handleExitQuiz();
    }

    //handle end of quiz
    const handleShowExitQuiz = async () => {
        clearInterval(globalScopeClock); //clear the current quiz's clock
        //console.log("setId " + cardsQuiz[0].belongset)
        console.log("time " + time);
        const setID = cardsQuiz[0].belongset;
        let res = await axios.post("http://localhost:3001/storeScore", {
            userID: getCookie('userid'),
            setID: flashcardsetinfo.flashcardset._id,
            score: score,
            time: time,
        });
        if (res.data == true) {

        } else {
            //navigate('/HomePage');
        }

        setShowContinueorExit(true);
    }

    const handleHideExit = () => {
        setShowContinueorExit(false);
    }

    const handleExitQuiz = async () => {
        
        
        if (earlyExit) {
            clearInterval(globalScopeClock);
            let res = await axios.post("http://localhost:3001/storeScore", {
                userID: getCookie('userid'),
                setID: flashcardsetinfo.flashcardset._id,
                score: score,
                time: -1,
            });
            earlyExit = false;
        //time = -1 means incomplete quiz
        }


        console.log("correct: " + previousCorrectPrompts);
        console.log("incorrect: " + previousIncorrectPrompts); 
        previousCorrectPrompts = [];
        previousIncorrectPrompts = [];
        timerToStop = true;
        
        

        score = 0;
        setShowContinueorExit(false);
        timerToStart = true;
        navigate(-1);

    }
        /****************************************************
         *      Core    Logic                               *
         *                                                  *
         ****************************************************/


    var selectedPromptIndex;
    if (readyForNewQuestion) {
        if (mode == "All prompts once") {
            selectedPromptIndex = randomCard(previousCorrectPrompts.concat(previousIncorrectPrompts));
            if (selectedPromptIndex < 0 || selectedPromptIndex >= cardsQuiz.length) {
                console.log("Out of bounds index");
                selectedPromptIndex = 0; //avoid crash/err
            }
            //console.log("length of exclusion" + );
            if (previousCorrectPrompts.concat(previousIncorrectPrompts).length >= cardsQuiz.length) {
                handleShowExitQuiz();
            }
        } else {console.log("error: Invalid mode")}

        var selectedCorrectPosition = randomButtonPlace();
        var selectedIncorrectAnswers = randomIncorrectArray([selectedPromptIndex]); //array size 3, indices, parameter is array because includes expects an array (prevent skip check of first index)
        
        console.log("position: " + selectedCorrectPosition);
        console.log("correct answer index:" + selectedPromptIndex);
        console.log("Incorrect: " + selectedIncorrectAnswers);
        //for (var i = 0; i < cardsQuiz.length; i++) {
        //    console.log(cardsQuiz[i].front + cardsQuiz[i].back);
        //}
        

        var answerIndices = []; //empty, used to fill answer options
        //loops through all possible positions of correct
        for (var i = 0; i < 4; i++) {
            if (i == selectedCorrectPosition) {
                answerIndices.push({Index: selectedPromptIndex, Correct:true}); //add when at selected index, correct choice
            }
            if (i != 3) answerIndices.push({Index: selectedIncorrectAnswers[i], Correct:false}); //add with index of incorrect array, not out of bounds
            
        }
        readyForNewQuestion = false; 
        currPrompt = selectedPromptIndex;
        currQuestion = answerIndices;
        console.log("Array of options" + answerIndices);
    
    }
    
    

   


    return(
        <div>
            
            <h1 style={{textAlign: "right", color: "gold"}}> Timer: </h1>
            <h1 style={{textAlign: "right", color: "gold"}}>  {(time - (time % 100))/100}.{(time % 100)/10}sec </h1>

            <Button className='abort' onClick={handleShowAbortQuiz}> Exit Quiz </Button>
            

            <h1 className="pad" style={{textAlign: "center", color: "gold"}}> Prompt: </h1>
            <br></br>
            <h1 className="pad" style={{textAlign: "center", color: "gold"}}> {cardsQuiz[currPrompt].front}</h1>
            <br></br>
            <h1 style={{textAlign: "center", color: "gold"}}> Answer Choices:</h1>
            <br></br>

            {/** Buttons for answer choices **/}        
            {currQuestion.map((item) => { 
                console.log(item);
                console.log(cardsQuiz[item.Index].front);
                console.log(cardsQuiz[item.Index].back);
                if (item.Correct){
                    //Correct answer
                    return(
                        <div style={{textAlign: 'center', justifyContent: 'center'}}>
                            <Button size='lg' onClick={handleSelectCorrectAnswer}> {cardsQuiz[item.Index].back}</Button>
                            <br></br>
                            <br></br>
                        </div>
                    );
                }
                    //Incorrect answer
                return(
                    <div style={{textAlign: 'center', justifyContent: 'center'}}>
                        <Button size='lg' onClick={handleSelectIncorrectAnswer}> {cardsQuiz[item.Index].back}</Button>
                        <br></br>
                        <br></br>
                    </div>
                )
            })}
            
            {/** Finished Quiz **/}        
            <Modal show={showContinueorExit} onHide={() => handleHideExit}>
                <Modal.Header>
                    <Modal.Title> Quiz Completed </Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    <h1>{correctness}</h1>       
                    <br></br>
                    <h1>Score: {score}</h1>
                    <br></br>
                    <h1>Time: {(time - (time % 100))/100}.{(time % 100)/10}sec</h1>
    
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleExitQuiz()}> Exit Quiz </Button>
                </Modal.Footer>
            </Modal>

            {/** Early Quit Quiz **/}        
            <Modal show={showAbortQuiz} onHide={() => handleHideAbortQuiz}>
                <Modal.Header>
                    <Modal.Title> Exit Quiz Prematurely? </Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    <h1>{correctness}</h1>       
                    <br></br>
                    <h1>Score: {score}</h1>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleHideAbortQuiz()}> Continue </Button>
                    <Button onClick={() => handleAbortQuiz()}> Exit Quiz </Button>
                </Modal.Footer>
            </Modal>

            {/** Question Feedback **/}        
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

//randomization functions, return idices @param array to exclude
function randomButtonPlace() {
        var index = -1;
        //random number 0-3
        index = Math.random() * 4;
        if (index == 4) index = 3;
        index = Math.floor(index);
        return index;
}

//returns index of a card within cardsQuiz
function randomCard(excludedIndices) {
    if (excludedIndices == null) {
        console.log("no exclusion")
        var index = -1;
        index = Math.random() * quizLength;
        if (index == quizLength) index = quizLength - 1;
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
            index = Math.random() * quizLength;
            if (index == quizLength) index = quizLength - 1;
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




export default QuizGame;