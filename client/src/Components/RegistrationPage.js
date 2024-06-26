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
 function checkvalidusername(str) {
    const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;
    if (usernameRegex.test(str)) {
        return true;
    } else {
      console.log("wrong format of username");
      return false;
    }
  }
function checkvalidpassword(str) {
    const passwordRegex = /^[A-Za-z0-9#?!@$%^&*-]{6,25}$/;
    if (passwordRegex.test(str)) {
      console.log("nicepassword!: " + str);
      return true;
    } else {
      console.log("wrong format of password");
      return false;
    }
  }  
function RegistrationPage() {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const emailRef = useRef();
    

    const handleSignUp = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate("/register");
        //Call to backend to check validity

    };
    const handleCreateAccount = async (event) => {
        //prevents page reload
        event.preventDefault();

        const registrationInfo = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            email: emailRef.current.value
        }
        if(checkvalidpassword(registrationInfo.password)&&checkvalidusername(registrationInfo.username) ){
            console.log(registrationInfo);
            let res = await axios.post("http://localhost:3001/createaccount", {
                registrationInfo: registrationInfo,
                });
            if(res.data===true){
                navigate("/");
            }else{
                alert("username already exist");
        }
        }
        else{
            alert("wrong format");
        }
        
    };
    return (
        <div className = "login-form">
            <form onSubmit = {handleCreateAccount}>
                <img alt = "Logo" className = "photo" src= {mylogo}/>
				<h1 style={{textAlign: "center", color: "gold"}}>Create BoilerCards Account</h1>
                <div className = "input-container">
                    <label style = {{textAlign: "left"}}>Email</label>
                    <input type="email" name = "email" placeholder="Enter Email" ref={emailRef} required />
                </div>
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

export default RegistrationPage;