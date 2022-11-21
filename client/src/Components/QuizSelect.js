import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
            <Button  onClick={handleReturnToSet}>
                Back to set
            </Button>
            <br></br>
            <p>Select quiz type</p>
            <br></br>
            <Button show={showSelection} onClick={handleTypeQuiz}>
                Type Answer
            </Button>
            <Button show={showSelection} onClick={handleChoiceQuiz}>
                Select Answer
            </Button>
            <br></br>
            <Button show={showSelection} onClick={handleLeaderboard}>
                Leaderboard
            </Button>
        </div>
    );



}

export default QuizSelect;