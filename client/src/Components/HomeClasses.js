import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import cookie from 'react-cookie';
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import { useNavigate } from 'react-router-dom';
import "./HomeClasses.css";

function HomeClasses() {
    const navigate = useNavigate();
    const [cookie, setCookie, removeCookie] = useCookies([]);
    const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('libdata')))
    const [show, setShow] = useState(false);
    const [code, setCode] = useState('')

    const handleClassClick = async(id) => {
        setCookie('classCode', id, { path: '/' });
        let res = await axios.post("http://localhost:3001/class", {
            classCode:getCookie('classCode')
        });
        console.log(res.data);
        localStorage.setItem('class', JSON.stringify(res.data));
        navigate('/class');
    }
    const handleClose = () => {
        setShow(false);
        setCode('');
    }
    const handleJoinClass = async() => {
        let res = await axios.post("http://localhost:3001/joinClass",{
            userID:getCookie('userid'),
            classCode:code,  
        });


        handleClose();
        console.log("code beyond reload executes");
        if (res.data == true) {
            //handleShowSaved(); //save icon
        }
        res = await axios.post("http://localhost:3001/loadspace", {
                uid:getCookie('userid'),
            });
            console.log(res.data);
            setLibrary(res.data);
            localStorage.setItem('libdata', JSON.stringify(res.data));
    }
    return (
        <div>
            <div style={{fontSize:'2.25rem', paddingTop: '3rem', color:'gold', paddingLeft: '10rem', paddingBottom: '2rem'}}>
                <heading>{getCookie('username')}'s Student HomePage: </heading>
            </div>
            <div className="box-classes">
                <h1 className="section-title">My Classes <Button variant='dark' onClick={() => setShow(true)}>Join Class</Button></h1>
                <div className= "home-boxes">
                    <table>
                        {Object.values(library.class).map(item => {
                            return (
                                <row>
                                    &nbsp; &nbsp;
                                    {/*<h1>{item._id}</h1>*/}
                                    <Button variant='warning' className= "library-buttons" value={item.classCode} onClick= {(e) => handleClassClick(e.target.value)}>
                                        {item.className}
                                    </Button>
                                    &nbsp; &nbsp;
                                </row>
                            );
                        })}
                    </table>    
                </div>
            </div>
            <Modal show={show} onHide={() => handleClose()}>
                <Modal.Header style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>Student List</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}> 
                    <h1></h1>
                    <label style = {{paddingRight: "1rem", fontSize: "1rem"}}>
                        Enter Class Code
                    </label>
                    <input type="text" name="classCode" onChange={(e) => setCode(e.target.value)} required />
                    <h1></h1>
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button onClick={() => handleClose()}> 
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleJoinClass}>
                        Join Class
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default HomeClasses;