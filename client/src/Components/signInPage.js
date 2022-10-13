import React, { useState } from "react";

import "./signInPage.css";
import mylogo from "../images/PurdueTrain.png";
import { useNavigate } from "react-router-dom";
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
    const [password, setPassword] = useState();
    const [username, setUsername] = useState();
    
    const handleSignUp = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate("/register");
        //Call to backend to check validity

    };
    const handleSignIn = (event) => {
        //prevents page reload
        event.preventDefault();

        const logginInfo = {
            username: username,
            password: password
        }
        //Call to backend to check validity
        //if good link to homepage with the persons info
        axios.get('http://localhost:3001/signin', logginInfo)
        .then(response => console.log(response.data))
        navigate("/HomePage");
    };
    return (
        <div className = "login-form">
            <form onSubmit = {handleSignIn}>
                <img alt = "Logo" className = "photo" src= {mylogo}/>
                <div className = "input-container">
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                
                <div className="button-container">
                    <input type="Button" value="Sign-Up" onClick = {handleSignUp}/>
                    <input type="Submit" value="Sign-In" />
                </div>
            </form>
        </div>
    );
}

export default SignInPage;