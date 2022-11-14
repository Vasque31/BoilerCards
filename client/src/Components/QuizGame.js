import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { cardsQuiz } from "./ViewFlashcard";
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import {CloseButton} from 'react';
import "./QuizGame.css";

var flashcardarray;
var score = 0;
var previousCorrectPrompts = [];
var previousIncorrectPrompts = [];
var clock = {
    tenthSec: 0,
    sec: 0,
};

function timer() {
    //     setClock({tenthSec: clock.tenthSec + 0, sec: clock.sec + 5});
    //     if (clock.tenthSec >= 10) {
    //         setClock({
    //             tenthSec: clock.tenthSec - 10,
    //             sec: clock.sec + 1,
    //         });
    //     }
        clock.tenthSec += 2;
        if (clock.tenthSec >= 10) {
            clock.tenthSec -= 10;
            clock.sec += 1
        }
}

var clockInterval = setInterval(timer(), 200)
//Assume new round onHide for now

function QuizGame() {
    console.log("Rendering Quiz Game")
    //flashcardarray = cardsQuiz;
    
    /*const [clock, setClock] = useState({
        tenthSec: 0,
        sec: 0,
    });*/
    const [correctness, setCorrectness] = useState("Correct");
    const navigate = useNavigate();
    const [showContinueorExit, setShowContinueorExit] = useState(false);
    const [showQuestionFeedback, setShowQuestionFeedback] = useState(false);
    var mode = "All prompts once";

    var selectedPromptIndex;
    if (mode == "All prompts once") {
        selectedPromptIndex = randomCard(previousCorrectPrompts.concat(previousIncorrectPrompts));
        if (selectedPromptIndex < 0 || selectedPromptIndex >= cardsQuiz.length) {
            console.log("Out of bounds index");
            selectedPromptIndex = 0; //avoid crash/err
        }
        //console.log("length of exclusion" + );
        if (previousCorrectPrompts.concat(previousIncorrectPrompts).length >= cardsQuiz.length) setShowContinueorExit(true);
    } else {console.log("error: Invalid mode")}



    var selectedCorrectPosition = randomButtonPlace();
    var selectedIncorrectAnswers = randomIncorrectArray([selectedPromptIndex]); //array size 3, indices, parameter is array because includes expects an array (prevent skip check of first index)
    
    console.log("position: " + selectedCorrectPosition);
    console.log("correct answer index:" + selectedPromptIndex);
    console.log("Incorrect: " + selectedIncorrectAnswers);
    for (var i = 0; i < cardsQuiz.length; i++) {
    //    console.log(cardsQuiz[i].front + cardsQuiz[i].back);
    }
    

    var answerIndices = []; //empty, used to fill answer options
    //loops through all possible positions of correct
    for (var i = 0; i < 4; i++) {
        if (i == selectedCorrectPosition) {
            answerIndices.push({Index: selectedPromptIndex, Correct:true}); //add when at selected index
        }
        if (i != 3) answerIndices.push({Index: selectedIncorrectAnswers[i], Correct:false}); //add with index of incorrect array, not out of bounds
        
    }
    console.log("Array of options" + answerIndices);
    //const [showSaved, setShowSaved] = useState(false);


    
    




    const handleSelectCorrectAnswer = () => {
        score++;
        setCorrectness("✅Correct\n");
        previousCorrectPrompts.push(selectedPromptIndex);
        setShowQuestionFeedback(true);
    }
    const handleSelectIncorrectAnswer = () => {
        score--;
        setCorrectness("⛔️Incorrect\n");
        previousIncorrectPrompts.push(selectedPromptIndex);
        setShowQuestionFeedback(true);
    }
    
    const handleNextQuestion = () => {

        setShowQuestionFeedback(false);
    }

    const handleNewRound = () => {
        /*let res = await axios.post("http://localhost:3001/bestscore",{
            uid: getCookie('u_id'),
            setid: cardsQuiz[0].belongset
            score: score,
        });*/
        //returns {BestScore: value, NewBestScore: true/false}
        console.log("correct: " + previousCorrectPrompts);
        console.log("incorrect: " + previousIncorrectPrompts); 
        previousCorrectPrompts = [];
        previousIncorrectPrompts = [];
        score = 0;
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
        previousCorrectPrompts = [];
        previousIncorrectPrompts = [];
        score = 0;
        clearInterval(clockInterval);
        setShowContinueorExit(false);
        navigate(-1);

    }




    return(
        <div>
            <h1 style={{textAlign: "right", color: "gold"}}> Timer: </h1>
            <h1 style={{textAlign: "right", color: "gold"}}> {clock.sec}.{clock.tenthSec} sec </h1>
            
            <h1 style={{textAlign: "center", color: "gold"}}> Prompt: </h1>
            <br></br>
            <h1 style={{textAlign: "center", color: "gold"}}> {cardsQuiz[selectedPromptIndex].front}</h1>
            <br></br>
            <h1 style={{textAlign: "center", color: "gold"}}> Answer Choices:</h1>
            <br></br>
            
            {answerIndices.map((item) => { 
                if (item.Correct){
                    //Correct answer
                    return(
                        <div style={{textAlign: 'center', justifyContent: 'center'}}>
                            <Button size='lg' onClick={handleSelectCorrectAnswer}> {cardsQuiz[item.Index].back}</Button>
                            <br></br>
                        </div>
                    );
                }
                    //Incorrect answer
                return(
                    <div style={{textAlign: 'center', justifyContent: 'center'}}>
                        <Button size='lg' onClick={handleSelectIncorrectAnswer}> {cardsQuiz[item.Index].back}</Button>
                        <br></br>
                    </div>
                )
            })}
            
                    
            <Modal show={showContinueorExit} onHide={() => handleNewRound}>
                <Modal.Header>
                    <Modal.Title> Another Round? </Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    <h1>{correctness}</h1>       
                    <br></br>
                    <h1>Score: {score}</h1>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleNewRound()}> New Round </Button>
                    <Button onClick={() => handleExitQuiz()}> Exit Quiz </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showQuestionFeedback} onHide={() => handleNextQuestion()}>
                <Modal.Header>
                    <Modal.Title> Another Round? </Modal.Title>
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
    console.log("inclusion check" + array + ",  " + value)
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) return true;
    }
    console.log("includes - false");
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




export default QuizGame;