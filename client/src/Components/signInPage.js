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
 export var libstorage = null;

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
    const handleSignIn = async (event) => {
        //prevents page reload
        event.preventDefault();
        const ip = await axios.get('https://geolocation-db.com/json/');
        const logginInfo = {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
          ip:ip.data.IPv4,
        };
        console.log(logginInfo);
        //Call to backend to check validity
        //if good link to homepage with the persons info
       let res = await axios.post("http://localhost:3001/signin", {
          logginfo: logginInfo,
        });
       
        console.log(res.data);
        let data = res.data;
        if(data===true){
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const currentuser = await axios.get("http://localhost:3001/getcuurrentuser");
            console.log(currentuser);
            let res = await axios.post("http://localhost:3001/loadspace", {
                uid:currentuser.data._id,
            });
            
            console.log(res.data);
            libstorage = res.data;
         
           
            navigate("/HomePage");
        }      
        else{
            alert("incorrect information");
        }
       
      };
    return (
        <div className = "login-form">
            <form onSubmit = {handleSignIn}>
                <img alt = "Logo" className = "photo" src= {mylogo}/>
                <h1 style={{textAlign: "center", color: "gold"}}>Welcome to BoilerCards</h1>
                <h2 style={{textAlign: "center", color: "gold"}}>Sign In</h2>
                <div className = "input-container">
                    <label style={{textAlign: "left"}}>Username</label>
                    <input type="text" name="username" placeholder="Enter Username" ref={usernameRef} required />
                </div>
                <div className="input-container">
                    <label style={{textAlign: "left"}}>Password </label>
                    <input type="password" name="password" placeholder="Enter Password" ref={passwordRef} required />
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