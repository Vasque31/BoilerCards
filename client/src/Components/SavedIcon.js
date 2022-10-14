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


export default SavedIcon;