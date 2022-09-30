import React, { useState } from "react";
import "./signInPage.css";
import mylogo from "../images/PurdueTrain.png";
//Use states for Sign In

const errors = {
    uname: "Invalid Username",
    pass: "Invalid Password"
};

function SignInPage() {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSignUp = (event) => {
        //prevents page reload
        event.preventDefault();
    
        //Call to backend to check validity

    };
    const handleSignIn = (event) => {
        //prevents page reload
        event.preventDefault();
    
        //Call to backend to check validity

    };
    return (
        <div className = "login-form">
            <form onSubmit = {handleSignIn}>
                <img alt = "Logo" className = "photo" src= {mylogo}/>
                <div className = "input-container">
                    <label>Username</label>
                    <input type="text" name="uname" required />
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <input type="password" name="pass" required />
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