import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { cardsQuiz } from "./ViewFlashcard";
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import {CloseButton} from 'react';
import "./QuizGame.css";

var flashcardarray;
var score = 0;
var previousPrompt = [];


//Assume new round onHide for now

function QuizGame() {
    console.log("Rendering Quiz Game")
    for (var i = 0; i < cardsQuiz.length; i++) {
        console.log(cardsQuiz[i].front + cardsQuiz[i].back);
    }
    flashcardarray = cardsQuiz;
    const [correctness, setCorrectness] = useState("Correct");
    const navigate = useNavigate();
    const [showContinueorExit, setShowContinueorExit] = useState(false);
    var selectedPromptIndex = randomCard(previousPrompt);
    var selectedCorrectPosition = randomButtonPlace();
    console.log("position: " + selectedCorrectPosition);
    console.log("correct answer index:" + selectedPromptIndex);
    var selectedIncorrectAnswers = randomIncorrectArray([selectedPromptIndex]); //array size 3, indices, parameter is array because includes expects an array (prevent skip check of first index)
    console.log("Incorrect: " + selectedIncorrectAnswers);
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
        previousPrompt = [selectedPromptIndex];
        setShowContinueorExit(true);
    }
    const handleSelectIncorrectAnswer = () => {
        setCorrectness("⛔️Incorrect\n");
        setShowContinueorExit(true);
    }
    
    const handleNewRound = () => {

        setShowContinueorExit(false);
    }
    const handleExitQuiz = () => {
        /*let res = await axios.post("http://localhost:3001/bestscore",{
            uid: getCookie('u_id'),
            setid: cardsQuiz[0].belongset
            score: score,
        });*/
        //returns {BestScore: value, NewBestScore: true/false}
        
        score = 0;
        setShowContinueorExit(false);
        navigate(-1);

    }
    return(
        <div>
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
                        </div>
                    );
                }
                    //Incorrect answer
                return(
                    <div style={{textAlign: 'center', justifyContent: 'center'}}>
                        <Button size='lg' onClick={handleSelectIncorrectAnswer}> {cardsQuiz[item.Index].back}</Button>
                    </div>
                )
            })}
            
                    
            <Modal show={showContinueorExit} onHide={() => handleNewRound}>
                <Modal.Header>
                    <Modal.Title> Another Round? </Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    <h1>{correctness}</h1>       
                    <h1>Score: {score}</h1>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleNewRound()}> New Round </Button>
                    <Button onClick={() => handleExitQuiz()}> Exit Quiz </Button>
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