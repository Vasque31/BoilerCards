import React, { useEffect, useRef, useState } from "react";
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
import cookie from 'react-cookie';
import {useCookies} from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup"; 
import {folder} from "./HomeLibrary";
import saveicon from "../images/saveicon.png";

import {libstorage} from "./signInPage.js";

function TeacherHeader() {
    const [show, setShow] = useState(false);
    const fileReader = new FileReader();
    const [destFolder, setDestFolder] = useState("");
    const [showFolder, setShowFolder] = useState(false);
    const [searchMethod, setSearchMethod] = useState(true);
    const [inputList, setinputList] = useState([{front:'', back:'', drate:'3', img: ''}]);
    const [folderName, setFoldername] = useState();
    const [subject, setSubject] = useState();
    const [statePrivate, setPrivate] = useState(true);
    const [name, setName] = useState();
    const navigate = useNavigate();
    const fileRef = useRef();
    const [label, setLabel] = useState('');
    const [subjects, setSubjects] = useState([JSON.parse(localStorage.getItem('subjects'))])


    const [library, setLibrary] = useState([]);
    useEffect(()=> {
        const getLibrary = async () => {
            let res = await axios.post("http://localhost:3001/getTeacherSpace", {
                userName:getCookie('username'),
            });
            console.log(res.data);
            setLibrary(res.data);
            localStorage.setItem('libdata', JSON.stringify(res.data));
            res = await axios.get("http://localhost:3001/subjectarray", {

            });
            localStorage.setItem('subjects', JSON.stringify(res.data));
            setSubjects(JSON.parse(localStorage.getItem('subjects')));
        }
        getLibrary();
    },[]);

    
    const [showSaved, setShowSaved] = useState(false);
    
    const handleShowSaved = () => {	setShowSaved(true);	}
    const handleCloseSaved = () => { 
        setShowSaved(false);
        window.location.reload(false);
    }
    {/* Image Handlers */}
    const handleimage = (e, i) => {
        const {name} = e.target;
        const list = [...inputList];
        fileReader.onload = r => {
            list[i][name]=r.target.result;
        };
        fileReader.readAsDataURL(e.target.files[0]);
        setinputList(list);
    }
    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:'', drate:'3', img: ''}]);
    }
    const handleinputchange = (e, index) => {
        const {name, value,rate} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
        console.log(inputList);
    } 
    const handleSave = async(event) => {
        if(destFolder!==''){
            event.preventDefault();
        const flashcardInfo = {
            inputList:inputList,
            name:name,
            statePrivate:statePrivate,
            folderid:destFolder,
        }
        console.log(flashcardInfo);
        let res = await axios.post("http://localhost:3001/createflashcardset", {
            inputList:flashcardInfo.inputList,
            name:flashcardInfo.name,
            public:flashcardInfo.statePrivate,
            folderid:flashcardInfo.folderid,
        });

        if(res.data===true){
            handleShowSaved();
        }
        handleClose();
        
        console.log(flashcardInfo);
        }   
    }

    const handleClose = () => {
        setShow(false);
        setinputList([{front:'', back:'', drate:'3', img: ''}]);
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
        let res = await axios.post("http://localhost:3001/createfolder",{
            folderName:folderName,
            label:subject,
            uid:getCookie('userid'),    
        });


        handleCloseFolder();
        console.log("code beyond reload executes");
        if (res.data == true) {
            handleShowSaved(); //save icon
        }
        res = await axios.post("http://localhost:3001/loadspace", {
                uid:getCookie('userid'),
            });
            console.log(res.data);
            setLibrary(res.data);
            localStorage.setItem('libdata', JSON.stringify(res.data));
        
    } 
    const onFileChange = () => {
        
    }
    const [search, setSearch] = useState("");
    const handleSearch = async () => {
        console.log(search);
        let res = await axios.post("http://localhost:3001/searchkeywords", {
                keyword:search,
        });
        localStorage.setItem('searchResults', JSON.stringify(res.data));
        console.log(res.data);
        navigate('/search');
        window.location.reload();
    }

    const handleSearchLabel = async () => {
        let res = await axios.post("http://localhost:3001/searchsubject", {
                subject:label,
        });
        localStorage.setItem('searchResults', JSON.stringify(res.data));
        console.log(res.data);
        navigate('/search');
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
                            <Link to="/TeacherHomePage">
                                <Button variant="Light">
                                    Home
                                </Button>
                            </Link>
                        </Nav.Link>
                        {searchMethod && <div style={{paddingTop: '1rem', paddingRight: '0.5rem'}}>
                        <Form>
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label="Search By Keyword"
                            onClick={() => setSearchMethod(false)}
                        />
                        </Form>
                        </div>}
                        {!searchMethod && <div style={{paddingTop: '1rem', paddingRight: '0.5rem'}}>
                        <Form>
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label="Search By Label"
                            onClick={() => setSearchMethod(true)}
                            defaultChecked
                        />
                        </Form>
                        </div>}

                        {!searchMethod && <div style={{paddingTop: '1rem', paddingRight: '0.5rem'}}>
                            <select name="LabelSelectList" id="LabelList" onChange={(e) => setLabel(e.currentTarget.value)}>
                            <option value="">---Choose---</option>
                                {subjects.map(item => {
                                    return (
                                        <option value={item}>{item}</option>    
                                    );
                                })}
                            </select>
                            <Button variant="dark" onClick={handleSearchLabel}>Search</Button>
                        </div>}

                        {searchMethod && <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                id='search'
                                className="me-2"
                                aria-label="Search"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button variant="dark" onClick={handleSearch}>Search</Button>
                        </Form>}

                         {/* Profile DropDown */}
                        
                        <NavDropdown title="Profile" id="basic-nav-dropdown" style={{paddingTop: '0.45rem'}}>
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

             {/* Save Modal */}
            
            <Modal show={showSaved}>
                <Modal.Header closeButton onClick={() => handleCloseSaved()}>
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

export default TeacherHeader;
