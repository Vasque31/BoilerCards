import React, { useEffect, useState } from "react";

import "./signInPage.css";
import mylogo from "../images/PurdueTrain.png";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import FacebookLogin from 'react-facebook-login';
import cookie from 'react-cookies'
//Use states for Sign In
const errors = {
    uname: "Invalid Username",
    pass: "Invalid Password"
};
 export var libstorage = null;

function SignInPage() {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [remember, setRememberMe] = useState(false);
    const [cookie, setCookie] = useCookies([]);
    const navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();

    useEffect(()=> {
        console.log(getCookie('remember'));
        if(getCookie('remember') === "true") {
            navigate("/HomePage");
        }
    },[]);
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
        let data = res.data;
        if(data!==false){
            // eslint-disable-next-line react-hooks/rules-of-hooks
            setCookie('userid', data, { path: '/' });
            console.log(getCookie('userid'));
            let res = await axios.post("http://localhost:3001/loadspace", {
                uid:data,
            });
            
            libstorage = res.data;
            if (remember === true) {
                setCookie('remember', true, { path: '/'});
            }
            navigate("/HomePage");

        }      
        else{
            alert("incorrect information");
        }
       
      };
    const responseFacebook = (response) => {
        console.log(response.email);
    }
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
                <input onClick={(e) => setRememberMe(!remember)} type="checkbox" />
                <b style ={{color: "gold"}}> Remember Me!</b>
                <div className="button-container">
                    <input type="Button" value="Sign-Up" onClick = {handleSignUp}/>
                    <input type="Submit" value="Sign-In" />
                </div>
                <FacebookLogin
                    appId="491848086337502"
                    autoLoad={true}
                    fields="name,email,picture"
                    size="small"
                    callback={responseFacebook} />
             
            </form>
            
        </div>
    );
}

export default SignInPage;