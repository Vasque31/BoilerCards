import React, { useRef, useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import saveicon from "../images/saveicon.png";
import Modal from 'react-bootstrap/Modal';
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
function ChangeCredentials() {
    const [oldusername, setOldUsername] = useState();
    const [newusername, setNewUsername] = useState();
    const [oldpassword, setOldPassword] = useState();
    const [newpassword, setNewPassword] = useState();
    const [showSaved, setShowSaved] = useState(false);

    const navigate = useNavigate();

    const handleShowSaved = () => {	setShowSaved(true);	}
    const handleCloseSaved = () => { setShowSaved(false);}    
    const handleSave = async (event) => {
        event.preventDefault();
        const newAccountInfo = {
            oldusername:oldusername,
            newusername:newusername,
            oldpassword:oldpassword,
            newpassword:newpassword
        }
        console.log(newAccountInfo);
        if(checkvalidpassword(newpassword)&&checkvalidusername(newusername)){
            let res = await axios.post("http://localhost:3001/changecredential", {
            oldusername:oldusername,
            newusername:newusername,
            oldpassword:oldpassword,
            newpassword:newpassword
            
        });
        if(res.data ===true){
            handleShowSaved();
            window.location.reload();
        }else{
            alert("password does not match")
        }
        console.log(newAccountInfo);
        }else{
            alert("wrong format");
        }
        
    }

    return (
        <div className="general-box-create">
            <div style={{textAlign: "left", fontSize: " 1.5rem"}}>
                    <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            <Form>
                <Form.Group style={{color: "gold"}}>
                    <Form.Label>Old Username</Form.Label>
                    <Form.Control type="text" name= "oldusername" placeholder="oldusername" onChange={e => setOldUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group style={{color: "gold"}}>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control type="text" name= "oldpassword" placeholder="oldpassword" onChange={e => setOldPassword(e.target.value)} />
                </Form.Group>
                <Form.Group style={{color: "gold"}}>
                    <Form.Label>New Username</Form.Label>
                    <Form.Control type="text" name= "newusername" placeholder="newusername" onChange={e => setNewUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group style={{color: "gold"}}>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="text" name= "newpassword" placeholder="newpassword" onChange={e => setNewPassword(e.target.value)} />
                </Form.Group>
            </Form>

            <div style={{paddingTop: "1rem"}}>
                <Button variant="primary" type="submit" onClick={handleSave}>
                    Update Credentials
                </Button>
            </div>
            <Modal show={showSaved} onHide={() => handleCloseSaved()}>
                <Modal.Header closeButton={() => handleCloseSaved()}>
                    <Modal.Title> Successful Operation</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                        <img className="photo" src= {saveicon}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleCloseSaved()}> Acknowledge </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChangeCredentials;
