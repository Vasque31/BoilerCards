import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import cookie from 'react-cookie';
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import { useNavigate } from 'react-router-dom';
import "./HomeClasses.css";

function TeacherHomeClasses() {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [cookie, setCookie] = useCookies([]);
    const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('libdata')))
    const navigate = useNavigate();
    const handleCreateClass = async () => {
        let res = await axios.post("http://localhost:3001/createClass",{
            userName:getCookie('username'),
            className:name,  
        });


        handleClose();
        console.log("code beyond reload executes");
        if (res.data == true) {
            //handleShowSaved(); //save icon
        }
        res = await axios.post("http://localhost:3001/getTeacherSpace", {
                userName:getCookie('username'),
            });
            console.log(res.data);
            setLibrary(res.data);
            localStorage.setItem('libdata', JSON.stringify(res.data));
    }
    const handleClassClick = async (id) => {
        //prevents page reload
        setCookie('classCode', id, { path: '/' });
        let res = await axios.post("http://localhost:3001/class", {
            classCode:getCookie('classCode')
        });
        console.log(res.data);
        localStorage.setItem('class', JSON.stringify(res.data));
        navigate('/teacherclass');
    } 
    const handleClose = () => {
        setShow(false);
        setName('');
    }
    return (
        <div>
            <div style={{fontSize:'2.25rem', paddingTop: '3rem', color:'gold', paddingLeft: '13rem', paddingBottom: '2rem'}}>
                <heading>{getCookie('username')}'s Educator HomePage: </heading>
            </div>
        <div className="box-classes">
            <div style={{display: 'flex', paddingBottom: '0.5rem'}}>
                <h1 className="section-title">My Classes</h1>
                &nbsp;&nbsp;
                <Button variant='warning' onClick={(e) => setShow(true)}>Create Class</Button>
            </div>
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
            <Modal show={show} onHide={handleClose} dialogClassName="general-box-createflash">
                <Modal.Header style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>
                        <h1 style ={{fontSize: "5rem", textAlign: "center"}}>BOILERCARDS</h1>
                        <h2 style ={{fontSize: "2rem", textAlign: "center"}}>Create Class</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey',color: "gold"}}>
                    <h1></h1>
                    <label style = {{paddingRight: "1rem", fontSize: "1rem"}}>Name Of Class</label>
                    <input type="text" name="className" onChange={(e) => setName(e.target.value)} required />
                    <h1></h1>
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black'}}>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateClass}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </div>
    );
}

export default TeacherHomeClasses;