import React, { useRef, useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from "react-router-dom";

function ChangeCredentials() {
    const [oldusername, setOldUsername] = useState();
    const [newusername, setNewUsername] = useState();
    const [oldpassword, setOldPassword] = useState();
    const [newpassword, setNewPassword] = useState();
    const navigate = useNavigate();

    const handleSave = (event) => {
        event.preventDefault();
        const newAccountInfo = {
            oldusername:oldusername,
            newusername:newusername,
            oldpassword:oldpassword,
            newpassword:newpassword
        }
        window.location.reload();

        console.log(newAccountInfo);
    }

    return (
        <div className="general-box-create">
            <div style={{textAlign: "left", fontSize: " 1.5rem"}}>
                    <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            <Form>
                <Form.Group style={{color: "gold"}}>
                    <Form.Label>Old Username</Form.Label>
                    <Form.Control type="text" name= "front" placeholder="Front of FlashCard" onChange={e => setOldUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group style={{color: "gold"}}>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control type="text" name= "back" placeholder="Back of FlashCard" onChange={e => setOldPassword(e.target.value)} />
                </Form.Group>
                <Form.Group style={{color: "gold"}}>
                    <Form.Label>New Username</Form.Label>
                    <Form.Control type="text" name= "front" placeholder="Front of FlashCard" onChange={e => setNewUsername(e)}/>
                </Form.Group>

                <Form.Group style={{color: "gold"}}>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="text" name= "back" placeholder="Back of FlashCard" onChange={e => setNewPassword(e.target.value)} />
                </Form.Group>
            </Form>

            <div style={{paddingTop: "1rem"}}>
                <Button variant="primary" type="submit" onClick={handleSave}>
                    Update Credentials
                </Button>
            </div>
        </div>
    );
}

export default ChangeCredentials;
