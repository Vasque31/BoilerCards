import React, { useState } from "react";
import Header from "./Header.js";
import Button from 'react-bootstrap/Button';
import "./RegistrationPage.css";

function RegistrationPage() {
    //const handleSeeMore = (event) => {
        //prevents page reload
        //event.preventDefault();
    
        //Call to backend to check validity

    //};

    return (
	<div>
	
	<div>
		  <label for="username"> username </label>
		  <input className="input-field" id="username"></input>
		  <br></br>
		  <label for="password"> password </label>
		  <br></br>
		  <input className="input-field" id="password"></input>
		  <br></br>
		  <label for="submit-button"> Submit </label>
	        <button className="submit-button" id="submit-button" onClick={() => submit(document.getElementById("username").value, document.getElementById("password").value)}></button>
	</div>
	</div>
    );
}

function submit(username, password) {
	console.log(username + password);

}

export default RegistrationPage;