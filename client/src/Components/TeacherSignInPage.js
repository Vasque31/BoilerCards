import React, { useEffect, useState } from "react";

import "./signInPage.css";
import mylogo from "../images/PurdueTrain.png";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import cookie from 'react-cookies'
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
//Use states for Sign In
const errors = {
    uname: "Invalid Username",
    pass: "Invalid Password"
};
 export var libstorage = null;
 function generateP() {
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';
      
    for (let i = 1; i <= 8; i++) {
        var char = Math.floor(Math.random()
                    * str.length + 1);
          
        pass += str.charAt(char)
    }
      
    return pass;
}
function TeacherSignInPage() {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [remember, setRememberMe] = useState(false);
    const [cookie, setCookie] = useCookies([]);
    const navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [resetShow, setResetShow] = useState(false);
    const handleResetShow = () => setResetShow(true);
    const handleResetClose = () => setResetShow(false);
    const [resetCode, setResetCode] = useState([{}]);
    const [resetUsername, setResetUsername] = useState("");
    const [resetCodeNum, setResetCodeNum] = useState(0);
    useEffect(()=> {
        console.log(getCookie('remember'));
        if(getCookie('remember') === "true") {
            navigate("/TeacherHomePage");
        }
        const initClient = () => {
            gapi.client.init({clientId: "787220324092-kbb7un09fomil67vjvmqabjvor5spdhb.apps.googleusercontent.com", scope: ''});
            gapi.load('client:auth2', initClient);
        }
    },[]);
    const handleSignUp = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate("/educatorregister");
        //Call to backend to check validity

    };
    const handleSubmitReset = async (event) => {
        event.preventDefault();
        setResetCode([{code: 0}]);
        let res = await axios.post("http://localhost:3001/verification", {
            username: resetUsername
        });
        
    }
    const handleSubmitCode = async (event) => {
        event.preventDefault();
        console.log(resetUsername);
        let res = await axios.post("http://localhost:3001/forgotpassword", {
            username: resetUsername,
            code: resetCodeNum
        });
        handleResetClose();
    }
    const handleChangeName = (event) => {
        setResetUsername(event.target.value);
    }
    const handleCodeChange = (event) => {
        setResetCodeNum(event.target.value);
    }
    const handleSignIn = async (event) => {
        //prevents page reload
        console.log("HELLLDSKFJOEIJFOWIEFJSOKDLFJLSDKFJ");
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
       let res = await axios.post("http://localhost:3001/teacherSignIn", {
          userName: logginInfo.username,
          password: logginInfo.password
        }); 
        let data = res.data;
        if(data!==false){
            // eslint-disable-next-line react-hooks/rules-of-hooks
            setCookie('userid', data, { path: '/' });
            console.log(getCookie('userid'));
            let res = await axios.post("http://localhost:3001/getTeacherSpace", {
                userName:logginInfo.username,
            });
            setCookie('username', logginInfo.username, { path: '/' });
            libstorage = res.data;
            console.log(libstorage);
            localStorage.setItem('libdata', JSON.stringify(res.data));
            if (remember === true) {
                setCookie('remember', true, { path: '/'});
            }
            navigate("/TeacherHomePage");

        }      
        else{
            alert("incorrect information");
        }
       
      };
    const responseFacebook = (response) => {
        console.log(response.email);
    }
   
    const handleStudentPage = () => {
        navigate('/');
    }
    const onGoogleFailure = (res) => {
        console.log(res);
    }
    return (
        <div className = "login-form">
            <div style={{textAlign: 'right'}}>
                <Button variant="link" style={{color:'gold'}} onClick={handleStudentPage}>SignUp/SignIn as Student<br></br></Button>
            </div>
            <form onSubmit = {handleSignIn}>
                <img alt = "Logo" className = "photo" src= {mylogo}/>
                <h1 style={{textAlign: "center", color: "gold"}}>Welcome to BoilerCards</h1>
                <h2 style={{textAlign: "center", color: "gold"}}>Educator Sign In</h2>
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
                <Button variant="link" onClick={handleResetShow}>Forgot Your Password?<br></br></Button>
                
            </form>
        <div>
            <Modal 
                show={resetShow}
                onHide={handleResetClose}
                backdrop="static">
        
                <Modal.Header closeButton>
                    <Modal.Title>Recover Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>Enter the email address you used to sign up for BoilerCards</Modal.Body>
                <Form onSubmit={handleSubmitReset}>
                    <Form.Group>
                        <Form.Label>Username<br/></Form.Label>
                        <Form.Control type="name" placeholder="Name" onChange={handleChangeName}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">Send Email</Button>
                </Form>
                <Modal.Body>
                    <Form onSubmit={handleSubmitCode}>
                        <Form.Group>
                            <Form.Label>Enter Verification Code from your Email</Form.Label>
                            <Form.Control type = "number" placeholder="Code" onChange = {handleCodeChange}/>
                        </Form.Group>
                        <Button variant="primary" type = "submit">Submit</Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </div>
        </div>
    );
}

export default TeacherSignInPage;