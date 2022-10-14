import "./SavedIcon.css";
import saveicon from "../images/saveicon.png";
import React from "react";
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from "react-router-dom";

function SavedIcon() {
	const navigate = useNavigate();
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

export default SavedIcon;