import "./SavedIcon.css";
import saveicon from "../images/saveicon.png";
import React from "react";


function SavedIcon() {

	return (
	  <div>
		<img className="photo" src= {saveicon}/>
		<p className="caption-text"> Saved </p>
	  </div>	
	);
}

export default SavedIcon;