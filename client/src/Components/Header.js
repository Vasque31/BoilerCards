import React, { useEffect, useState } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import "./Header.css";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { getCookie } from 'react-use-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup"; 
import {folder} from "./HomeLibrary";

function Header() {
    const [show, setShow] = useState(false);
    const [destFolder, setDestFolder] = useState("");
    const [showFolder, setShowFolder] = useState(false);
    const [inputList, setinputList] = useState([{front:'', back:''}]);
    const [folderName, setFoldername] = useState();
    const [statePrivate, setPrivate] = useState(1);
    const [name, setName] = useState();
    const navigate = useNavigate();
    const [library, setLibrary] = useState(folder);
    
    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:''}]);
    }
    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
    } 
    const handleSave = async(event) => {
        event.preventDefault();

        const flashcardInfo = {
            inputList:inputList,
            name:name
        }
        let res = await axios.post("http://localhost:3001/createflashcardsethome", {
            inputList:flashcardInfo.inputList,
            name:flashcardInfo.name,
            public:statePrivate,
        });
        if(res.data===true){
            alert("success");
        }
        handleClose();
        console.log(flashcardInfo);
    }

    const handleClose = () => {
        setShow(false);
        setinputList([{front:'', back:''}]);
    }
    const handleShow = async() => {
        let res = await axios.post("http://localhost:3001/loadspace", {
            uid:getCookie('userid'),
        });
        setLibrary(res.data);
        setShow(true);
    }
    const handleShowFolder = () => setShowFolder(true);
    const handleCloseFolder = () => {
        setShowFolder(false);
 
    }
    const handleSaveFolder = async(event) => {
        await axios.post("http://localhost:3001/createfolder",{
            folderName:folderName,
            uid:getCookie('userid'),    
        });
        window.location.reload();
    } 
    return (
        <div className="app">
            <Navbar variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>BoilerCards</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link>
                            <Link to="/HomePage">
                                <Button variant="Light">
                                    Home
                                </Button>
                            </Link>
                        </Nav.Link>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="dark">Search</Button>
                        </Form>
                        <NavDropdown title="Create" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                                Class
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Button variant="Light" onClick={handleShowFolder}>
                                    Folder
                                </Button>
                                <div>
                                <Modal show={showFolder} onHide={handleCloseFolder} backdrop="static" dialogClassName="general-box-createfolder">
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            <h1 style ={{fontSize: "3rem", color:"gold", textAlign:"center"}}>BOILERCARDS</h1>
                                            <h2 style ={{fontSize: "1rem", color:"gold", textAlign:"center"}}>Create Folder</h2>
                                        </Modal.Title>
                                        
                                    </Modal.Header>
                                    <Modal.Body>
                                            <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name of New Folder: </label>
                                            <input type="text" name = "folderName" onChange={(e) => setFoldername(e.target.value)} required />
                                    </Modal.Body>
                                    <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleSaveFolder}>
                                                Save New Folder
                                            </Button>
                                    </Modal.Footer>
                                </Modal>
                                </div>
                            </NavDropdown.Item>
                            
                            <NavDropdown.Item>
                                    <Button variant="Light" onClick={handleShow}>
                                        Flashcard Set
                                    </Button>
                                    <Modal show={show} onHide={handleClose} dialogClassName="general-box-createflash">
                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                            <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
                                            <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Create Flashcard Set</h2>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <label>Destination Folder</label>&nbsp; &nbsp;
                                                &nbsp; &nbsp;
                                                <select name="selectList" id="selectList">
                                                    <option value="option 1">Option 1</option>
                                                    <option value="option 2">Option 2</option>
                                                </select>
                                                &nbsp; &nbsp;
                                            <h1></h1>
                                            <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name Of FlashCard Set</label>
                                            <input type="text" name="flashcardSetName" onChange={(e) => setName(e.target.value)} required />
                                            <h1></h1>
                                            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                                                <ToggleButton id="private-button" variant="outline-danger" value={1} onClick={(e) => setPrivate(e.currentTarget.value)}>
                                                    Private
                                                </ToggleButton>
                                                <ToggleButton id="public-button" variant="outline-success" value={0} onClick={(e) => setPrivate(e.currentTarget.value)}>
                                                    Public
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                            {
                                            inputList.map((x,i) => { 
                                                return(
                                                <Form>
                                                    <Form.Group style={{color: "gold"}}>
                                                        <h1>#{i+1}</h1>
                                                        <Form.Label>Front of Card</Form.Label>
                                                        <Form.Control type="text" name= "front" placeholder="Front of FlashCard" onChange={e => handleinputchange(e,i)}/>
                                                    </Form.Group>

                                                    <Form.Group style={{color: "gold"}}>
                                                        <Form.Label>Back of Card</Form.Label>
                                                        <Form.Control type="text" name= "back" placeholder="Back of FlashCard" onChange={e => handleinputchange(e,i)} />
                                                    </Form.Group>
                                                </Form>
                                                );
                                            })}
                                            <div style={{paddingTop: "1rem"}}>
                                                <Button varient= "primary" type="button" onClick={handleaddmore}>
                                                    Add FlashCard
                                                </Button>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleSave}>
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                            </NavDropdown.Item> 
                        </NavDropdown>
                        
                        <NavDropdown title="Profile" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                                Account Data
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to="/settings">
                                    <Button variant="Light">
                                        Settings
                                    </Button>
                                </Link>
                            </NavDropdown.Item> 
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>  
                </Container>
            </Navbar>
        </div>
    );
}

export default Header;