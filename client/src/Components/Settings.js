import React, { useState } from "react";
import "./Settings.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import CloseButton from 'react-bootstrap/CloseButton';

function Settings() {

    return (
        <div>
            <div className="settings">
                <div className="close-button">
                    <CloseButton variant= "white"/>
                </div>
                <header style={{fontSize: '3.5rem', color: 'gold'}}>BoilerCard Profile Settings</header>
                <ListGroup>
                    <ListGroup.Item action>
                        Change Username
                    </ListGroup.Item>
                    <ListGroup.Item action>
                        Reset Password
                    </ListGroup.Item>
                    <ListGroup.Item action>
                        Logout
                    </ListGroup.Item>
                </ListGroup>
            </div>
        </div>
    );
}

export default Settings;