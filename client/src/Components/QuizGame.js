import { Button } from "bootstrap";
import { useNavigate } from "react-router-dom";



var flashcardarray;
var score = 0;

//Assume new round onHide for now

function QuizGame() {

    const navigate = useNavigate();
    const [showContinueorExit, setShowContinueorExit] = useState(false);

    const handleSelectAnswer = () => {


    }
    
    const handleNewRound = () => {


    }
    const handleExitQuiz = () => {


    }
    return(
        <div>
            <p> Prompt: </p>
            <br></br>
            <p> {} </p>
            <br></br>
            <p> Answer Choices:</p>
            {flashcardarray.map(item => {
                return(
                    <Button onClick={handleSelectAnswer()}>{item.back}</Button>
                );
            }) 
            }
            <Modal show={showContinueorExit} onHide={() => handleNewRound}>
                <Modal.Header>
                    <Modal.Title>Another Round?</Modal.Title>
                </Modal.Header>
                <Modal.Body> Score: {score} </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleNewRound()}> New Round </Button>
                    <Button onClick={() => handleExitQuiz()}> End Game </Button>
                </Modal.Footer>
            </Modal>

            
        </div>
    );


}