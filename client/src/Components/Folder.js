import React, { useEffect, useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import {folder} from './HomeLibrary';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import cookie from 'react-cookies'
export var flashcards = null;
 
function Folder() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [statePrivate, setPrivate] = useState(false);
    const [TMPName, setTMPName] = useState("");
    const [showSetting, setShowSetting] = useState(false);
    const [cookie, setCookie] = useCookies([]);
    const [inputList, setinputList] = useState([{front:'', back:''}]);
    const [name, setName] = useState();
    const [library, setLibrary] = useState(folder);
    
    useEffect(()=> {
        setTimeout(() => {
            const getLibrary = async () => {
                let res = await axios.post("http://localhost:3001/folder", {
                    folderid:getCookie('folderid'),
                });
                setLibrary(res.data);
            }
            getLibrary();
        }, 3000);
    },[]);

    const handleFlashcardClick = async (id) => {
        //prevents page reload
        console.log(id);
        let res = await axios.post("http://localhost:3001/flsahcardset", {
            setid:id
        });
        flashcards = res.data;
        console.log(flashcards);
        navigate('/flashcard');
    };


    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:''}]);
    }
    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
    } 
    const handleFolderNameChange = (e) => {
        setTMPName(e.target.value);
        console.log(TMPName);
    }
    const handleCreateFlashCardSet = async(event) => {
        event.preventDefault();

        const flashcardInfo = {
            inputList:inputList,
            name:name
        }
        let res = await axios.post("http://localhost:3001/createflashcardset", {
            inputList:flashcardInfo.inputList,
            name:flashcardInfo.name,
        });
        if(res.data===true){
            alert("success");
        }
        handleClose();
        console.log(flashcardInfo);
    }
    const handleSave = async(event) => {
        event.preventDefault();
        console.log(library);
        library.foldername = TMPName;
    
        let res = await axios.post("http://localhost:3001/editfolder", {
            folder:library
        });
        if(res.data===true){
            alert("success");
        }
        handleClose();
    }

    const handleClose = () => {
        setShow(false);
        setinputList([{front:'', back:''}]);
    }
    const handleShow = () => setShow(true);
    const handleCloseSetting = () => {
        setShowSetting(false);
        setTMPName("");
        setPrivate(false);
    }
    const handleShowSetting = () => setShowSetting(true);
    return (
        <div>
            <Header/>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            
            <div className="box">

                <heading className="section-title">{library.foldername}</heading>
                <div style ={{textAlign: "right", paddingBottom: "0.5rem"}}>
                    <Button variant="warning" onClick={handleShow}>
                        Create Flashcard Set
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="warning" onClick={handleShowSetting}>
                        Folder Settings
                    </Button>
                </div>
                <div className= "library-box">
                    {Object.values(library.flashcardset).map(item => {
                        return (
                            <div>
                                {/*<h1>{item._id}</h1>*/}
                                <button className= "library-buttons" value={item._id} onClick={(e) => handleFlashcardClick(e.target.value)}>
                                    {item.setname}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Modal show={show} onHide={handleClose} dialogClassName="general-box-createflash">
                <Modal.Header>
                    <Modal.Title>
                        <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
                        <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Create Flashcard Set</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name Of FlashCard Set</label>
                    <input type="text" name="flashcardSetName" onChange={(e) => setName(e.target.value)} required />
                    {inputList.map((x,i) => { 
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
                    <Button variant="primary" onClick={handleCreateFlashCardSet}>
                        Create FlashCard Set
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSetting} onHide={handleCloseSetting} dialogClassName="general-box-createflash">
                <Modal.Header>
                    <Modal.Title>
                        <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
                        <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Folder Settings</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group style={{color: "gold"}}>
                            <input onChange={e => handleFolderNameChange(e)}></input>
                        </Form.Group>
                    </Form>                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSetting}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Folder;