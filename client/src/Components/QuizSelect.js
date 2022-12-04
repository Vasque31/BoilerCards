import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizSelect.css";

function QuizSelect() {
  const [showSelection, setShowSelection] = useState(true);
  const navigate = useNavigate();

  const handleTypeQuiz = () => {
    navigate("/typedquiz");
  };

  const handleChoiceQuiz = () => {
    navigate("/quizgame");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  const handleReturnToSet = () => {
    navigate(-1);
  };

  return (
    <div className="quiz-container">
      <Button className="back" onClick={handleReturnToSet}>
        Back to set
      </Button>
      <div>
        <br></br>
        <div className="d-grid gap-2">
          <Button
            className="leaderboard-button"
            show={showSelection}
            onClick={handleLeaderboard}
          >
            Leaderboard
          </Button>
        </div>
        <div className="quiz-div">
          <p className="info-text">Select quiz type</p>
          <div>
          <Button
            className="select-button"
            show={showSelection}
            onClick={handleTypeQuiz}
            size='lg'
          >
            Type Answer
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            className="type-button"
            show={showSelection}
            onClick={handleChoiceQuiz}
            size='lg'
          >
            Select Answer
          </Button>
          </div>
        </div>
      </div>
      <br></br>
    </div>
  );
}

export default QuizSelect;
