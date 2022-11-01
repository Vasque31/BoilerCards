import "./SavedIcon.css";
import saveicon from "../images/saveicon.png";
import React from "react";
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from "react-router-dom";

function SavedIcon() {
	const navigate = useNavigate();
	function closeIcon() {
		navigate("/HomePage");
	}

	return (
	  <div className="saveicon">
		<CloseButton variant= "black" onClick={() => navigate(-1)}/>
		<img className="photo" src= {saveicon}/>
		<p className="caption-text"> Saved </p>
	  </div>	
	);
} 

/*function closeIcon() {
	navigate("/HomePage");
}*/


/* Modal mockup
import saveicon from "../images/saveicon.png";

			const [showSaved, setShowSaved] = useState(false);

			const handleShowSaved = () => {	setShowSaved(true);	}
			const handleCloseSaved = () => { setShowSaved(false);}
			
			<Modal show={showSaved} onHide={() => handleCloseSaved()}>
                <Modal.Header closeButton={() => handleCloseSaved()}>
                    <Modal.Title> Successful Operation</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                        <img className="photo" src= {saveicon}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleCloseSaved()}> Acknowledge </Button>
                </Modal.Footer>
            </Modal>

*/
export default SavedIcon;