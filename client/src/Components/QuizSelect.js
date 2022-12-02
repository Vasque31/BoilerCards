import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizSelect.css";

function QuizSelect() {

    const [showSelection, setShowSelection] = useState(true);
    const navigate = useNavigate();


    const handleTypeQuiz = () => {

        navigate("/typedquiz");
    }

    const handleChoiceQuiz = () => {


        navigate("/quizgame");
    }

    const handleLeaderboard = () => {


        navigate("/leaderboard");
    }



    const handleReturnToSet = () => {

        navigate(-1);
    }



    return(
        <div>
            <Button className="back" onClick={handleReturnToSet}>
                Back to set
            </Button>
            <br></br>
            <div className="quiz-div">
                <p className="info-text">Select quiz type</p>
                <br></br>
                <Button className="select-button" show={showSelection} onClick={handleTypeQuiz}>
                    Type Answer
                </Button>
                <Button className="type-button" show={showSelection} onClick={handleChoiceQuiz}>
                    Select Answer
                </Button>
                <Button className="leaderboard-button" show={showSelection} onClick={handleLeaderboard}>
                    Leaderboard
                </Button>
            </div>
            <br></br>
            
        </div>
    );



}

export default QuizSelect;