import React, { useState } from "react";

import "./signInPage.css";
import mylogo from "../images/PurdueTrain.png";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
//Use states for Sign In

const errors = {
    uname: "Invalid Username",
    pass: "Invalid Password"
};

function SignInPage() {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSignUp = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate("/register");
        //Call to backend to check validity

    };
    const handleCreateAccount = (event) => {
        //prevents page reload
        event.preventDefault();

        const registrationInfo = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }
        console.log(registrationInfo);
        //Call to backend to check validity
        //if good link to homepage with the persons info
        axios.post('http://localhost:3001/signin', registrationInfo)
        .then(response => console.log(response.data))
        navigate("/");
    };
    return (
        <div className = "login-form">
            <form onSubmit = {handleCreateAccount}>
                <img alt = "Logo" className = "photo" src= {mylogo}/>
				<h1 style={{textAlign: "center", color: "gold"}}>Create BoilerCards Account</h1>
                <div className = "input-container">
                    <label style={{textAlign: "left"}}>Username</label>
                    <input type="text" name="username" placeholder="Enter Username" ref={usernameRef} required />
                </div>
                <div className="input-container">
                    <label style={{textAlign: "left"}}>Password </label>
                    <input type="password" name="password" placeholder="Enter Password" ref={passwordRef} required />
                </div>
                
                <div className="button-container">
                    <input type="Submit" value="Create Account" />
                </div>
            </form>
        </div>
    );
}

export default SignInPage;