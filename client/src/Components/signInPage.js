import React, { useEffect, useState } from "react";

import "./signInPage.css";
import mylogo from "../images/PurdueTrain.png";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { getCookie } from "react-use-cookie";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import cookie from "react-cookies";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import saveicon from "../images/saveicon.png";
//Use states for Sign In
const errors = {
  uname: "Invalid Username",
  pass: "Invalid Password",
};
export var libstorage = null;
function generateP() {
  var pass = "";
  var str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 8; i++) {
    var char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
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
function SignInPage() {
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
  const [resetPWShow, setResetPWShow] = useState(false);
  const [resetPW, setResetPW] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const handleShowSaved = () => {
    setShowSaved(true);
  };
  const handleCloseSaved = () => {
    setShowSaved(false);
  };
  useEffect(() => {
    console.log(getCookie("remember"));
    if (getCookie("remember") === "true" && getCookie("teacher") === "false") {
      navigate("/HomePage");
    } else if (
      getCookie("remember") === "true" &&
      getCookie("teacher") === "true"
    ) {
      navigate("/TeacherHomePage");
    }
    const initClient = () => {
      gapi.client.init({
        clientId:
          "787220324092-kbb7un09fomil67vjvmqabjvor5spdhb.apps.googleusercontent.com",
        scope: "",
      });
      gapi.load("client:auth2", initClient);
    };
  }, []);
  const handleSignUp = (event) => {
    //prevents page reload
    event.preventDefault();
    navigate("/register");
    //Call to backend to check validity
  };
  const handleSubmitReset = async (event) => {
    event.preventDefault();
    setResetCode([{ code: 0 }]);
    let res = await axios.post("http://localhost:3001/verification", {
      username: resetUsername,
    });
    handleResetClose();
    handleResetPWShow();
  };
  const handleSubmitCode = async (event) => {
    event.preventDefault();
    console.log(resetUsername);
    let res = await axios.post("http://localhost:3001/forgotpassword", {
      username: resetUsername,
      code: resetCodeNum,
    });
    handleResetClose();
  };
  const handleChangeName = (event) => {
    setResetUsername(event.target.value);
  };
  const handleSignIn = async (event) => {
    //prevents page reload
    console.log("HELLLDSKFJOEIJFOWIEFJSOKDLFJLSDKFJ");
    event.preventDefault();
    const ip = await axios.get("https://geolocation-db.com/json/");
    const logginInfo = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      ip: ip.data.IPv4,
    };
    console.log(logginInfo);
    //Call to backend to check validity
    //if good link to homepage with the persons info
    let res = await axios.post("http://localhost:3001/signin", {
      logginfo: logginInfo,
    });
    let data = res.data;
    if (data !== false) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setCookie("userid", data, { path: "/" });
      setCookie("username", usernameRef.current.value, { path: "/" });
      setCookie("teacher", false, { path: "/" });
      console.log(getCookie("userid"));
      let res = await axios.post("http://localhost:3001/loadspace", {
        uid: data,
      });

      libstorage = res.data;
      console.log(libstorage);
      localStorage.setItem("libdata", JSON.stringify(res.data));

      if (remember === true) {
        setCookie("remember", true, { path: "/" });
      }
      navigate("/HomePage");
    } else {
      alert("incorrect information");
    }
  };
  const onGoogleSuccess = async (res) => {
    const password = generateP();
    const username = res.profileObj.email;
    const email = res.profileObj.email;
    const registrationInfo = {
      username: username,
      email: email,
      password: password,
    };
    const checkEmail = await axios.post("http://localhost:3001/checkEmail", {
      email: email,
    });
    if (checkEmail.data === false) {
      await axios.post("http://localhost:3001/createaccount", {
        registrationInfo: registrationInfo,
      });
    } else {
      console.log("already exist");
    }
    const logginInfo = {
      username: email,
    };
    //Call to backend to check validity
    //if good link to homepage with the persons info
    let signin = await axios.post("http://localhost:3001/googleSignin", {
      logginfo: logginInfo,
    });
    console.log(signin);
    let data = signin.data;
    console.log(data);
    setCookie("userid", data, { path: "/" });
    setCookie("remember", true, { path: "/" });
    setCookie("teacher", false, { path: "/" });
    setCookie("username", email, { path: "/" });
    console.log(getCookie("userid"));
    let loadspace = await axios.post("http://localhost:3001/loadspace", {
      uid: data,
    });
    localStorage.setItem("libdata", JSON.stringify(loadspace.data));
    libstorage = loadspace.data;
    navigate("/HomePage");
  };
  const handleTeacherPage = () => {
    navigate("/educatorsignin");
  };
  const onGoogleFailure = (res) => {
    console.log(res);
  };
  const handleResetPWClose = () => {
    setResetPWShow(false);
  };
  const handleResetPWShow = () => {
    setResetPWShow(true);
  };
  const handleSubmitResetPW = async (event) => {
    event.preventDefault();
    let valid = checkvalidpassword(resetPW);
    let username = resetUsername;
    if (valid) {
      let res = await axios.post("http://localhost:3001/forgotpassword", {
        username: username,
        code: resetCodeNum,
        newPass: resetPW,
      });
      if (res.data === true) {
        handleResetPWClose();
        handleShowSaved();
      } else {
        alert("Incorrect Code");
      }
    } else {
      alert("Incorrect Password Format");
    }
    handleResetPWClose();
  };
  const handleChangeCode = (event) => {
    setResetCodeNum(event.target.value);
  };
  const handlePWChange = (event) => {
    setResetPW(event.target.value);
  };
  return (
    <div className="login-form">
      <div style={{ textAlign: "right" }}>
        <Button
          variant="link"
          style={{ color: "gold" }}
          onClick={handleTeacherPage}
        >
          SignUp/SignIn as Educator<br></br>
        </Button>
      </div>
      <form onSubmit={handleSignIn}>
        <img alt="Logo" className="photo" src={mylogo} />
        <h1 style={{ textAlign: "center", color: "gold" }}>
          Welcome to BoilerCards
        </h1>
        <h2 style={{ textAlign: "center", color: "gold" }}>Student Sign In</h2>
        <div className="input-container">
          <label style={{ textAlign: "left" }}>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            ref={usernameRef}
            required
          />
        </div>
        <div className="input-container">
          <label style={{ textAlign: "left" }}>Password </label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            ref={passwordRef}
            required
          />
        </div>
        <input onClick={(e) => setRememberMe(!remember)} type="checkbox" />
        <b style={{ color: "gold" }}> Remember Me!</b>
        <div className="button-container">
          <input type="Button" value="Sign-Up" onClick={handleSignUp} />
          <input type="Submit" value="Sign-In" />
        </div>
        <Button variant="link" onClick={handleResetShow}>
          Forgot Your Password?<br></br>
        </Button>
      </form>

      <GoogleLogin
        clientId="787220324092-kbb7un09fomil67vjvmqabjvor5spdhb.apps.googleusercontent.com"
        buttonText="Sign in with Google"
        onSuccess={onGoogleSuccess}
        onFailure={onGoogleFailure}
      />

      <div>
        <Modal show={resetShow} onHide={handleResetClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Recover Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Enter the username you used to sign up for BoilerCards
          </Modal.Body>
          <Form onSubmit={handleSubmitReset}>
            <Form.Group>
              <Form.Label>
                Username
                <br />
              </Form.Label>
              <Form.Control
                type="name"
                placeholder="Username"
                onChange={handleChangeName}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send Email
            </Button>
          </Form>
        </Modal>
      </div>
      <div>
        <Modal show={resetPWShow} onHide={handleResetPWClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitResetPW}>
              <Form.Group>
                <Form.Label>
                  Code
                  <br />
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0000"
                  onChange={handleChangeCode}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  New Password
                  <br />
                </Form.Label>
                <Form.Control onChange={handlePWChange} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Reset Password
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      <div>
        <Modal show={showSaved} onHide={() => handleCloseSaved()}>
          <Modal.Header closeButton={() => handleCloseSaved()}>
            <Modal.Title> Successful Operation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img className="photo" src={saveicon} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => handleCloseSaved()}> Acknowledge </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default SignInPage;
