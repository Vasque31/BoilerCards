import React, { useState } from "react";
import "./Settings.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import CloseButton from 'react-bootstrap/CloseButton';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['userid']);
    const handleClick = () => {
        removeCookie('userid');
        removeCookie('folderid');
        setCookie('remember', false, { path: '/'})
        navigate("/");
    };
    return (
        <div>
            <div className="settings">
                <div style={{textAlign: "left", fontSize: " 1.5rem"}}>
                    <CloseButton variant= "white" onClick={() => navigate(-1)}/>
                </div>
                <header style={{fontSize: '3.5rem', color: 'gold'}}>BoilerCard Profile Settings</header>
                <ListGroup>
                    <ListGroup.Item>
                        <Link to="/changecredentials">
                            <Button variant="Light">
                                    Change Credentials
                                </Button>
                        </Link>
                    </ListGroup.Item>
                    <ListGroup.Item action>
                        <Button variant="Light" onClick={handleClick}>
                            Logout
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </div>
        </div>
    );
}

export default Settings;
