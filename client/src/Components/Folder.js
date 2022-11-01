import React, { useEffect, useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { UNSAFE_enhanceManualRouteObjects, useNavigate } from 'react-router-dom';
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
import saveicon from "../images/saveicon.png";

import cookie from 'react-cookies'
export var flashcards = null;

//var to update modal display, initialized with dummy values to prevent null crash
var selectedFlashcardsetToDelete = {
    setname: "defaultname set",
};
var selectedFlashcardsetToCopy = {
    setname: "defaultname set",
}; 
var currentUser = {
    folder: new Map(), 
};

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
    const [destFolder, setDestFolder] = useState("");
    const [showFolderDeleteConfirm, setShowFolderDeleteConfirm] = useState(false);
    const [showFlashcardsetDeleteConfirm, setShowFlashcardsetDeleteConfirm] = useState(false);
    const [showFlashcardsetCopy, setShowFlashcardsetCopy] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    const handleShowSaved = () => { setShowSaved(true);}
    const handleCloseSaved = () => { setShowSaved(false);}
    const handleCloseFlashsetDelCon = () => {setShowFlashcardsetDeleteConfirm(false);}
    const handleCloseFolderDeleteConfirm = () => {setShowFolderDeleteConfirm(false);}
    const handleShowFolderDeleteConfirm = () => {setShowFolderDeleteConfirm(true);}
    const handleShowFlashcardsetDeleteConfirm = async (id) => {
        let res = await axios.post("http://localhost:3001/flsahcardset",{
            setid:id,
        });
        selectedFlashcardsetToDelete = res.data;
        console.log();
        selectedFlashcardsetToDelete.setname = selectedFlashcardsetToDelete.flashcardset.setname;
        setShowFlashcardsetDeleteConfirm(true);
    }
    const handleShowFlashcardsetCopy = async (id) =>{
        /*let res = await axios.post("http://localhost:3001/currentuser",{
        });
        currentUser = res.data;*/
        let res = await axios.post("http://localhost:3001/flsahcardset",{
            setid:id,
        });
        selectedFlashcardsetToCopy = res.data; //not flashcardset object, but folderinfo object
        selectedFlashcardsetToCopy.setname = selectedFlashcardsetToCopy.flashcardset.setname;
        setShowFlashcardsetCopy(true);
    }

    const handleCloseFlashsetCopy = () => {
        setShowFlashcardsetCopy(false);
    }
    const handleCopyFlashcardset = async (folderid) => {


    }

    const handleDeleteFolder = async(object) => {
        let res = await axios.post("http://localhost:3001/deletefolder",{
            folder:library,
        });
        if (res.data == true) {
            handleShowSaved();
            navigate("/HomePage"); //folder deleted, leave it
        }
    }
    const handleDeleteFlashcardset = async (object) => {
        const setinfo = object;
        setinfo.setid = object._id;
        let res = await axios.post("http://localhost:3001/deletFlashcardset",{
            setid: object._id,
            
        });
        if (res.data == true) {
            handleCloseFlashsetDelCon(); //remove confirmation upon success
            handleShowSaved();
        }
    }
    
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
            name:name,
            statePrivate:statePrivate,
            folderid:folder._id,
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
    const handleSave = async(event) => {
        event.preventDefault();
        console.log(library);
        library.foldername = TMPName;
    
        let res = await axios.post("http://localhost:3001/editfolder", {
            folder:library,
        });
        
        if(res.data===true){
            handleShowSaved();
        }
        handleCloseSetting();
    }

    const handleClose = () => {
        setShow(false);
        setinputList([{front:'', back:''}]);
    }
    const handleShow = () => setShow(true);
    const handleCloseSetting = () => {
        setShowSetting(false);
        setTMPName("");
    }
    const handleShowSetting = () => setShowSetting(true);
    return (
        <div>
            <Header/>
            <Button value={library._id} onClick={() => handleShowFolderDeleteConfirm()}>Delete Folder</Button>
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
                <table>
                    {Object.values(library.flashcardset).map(item => {
                        return (
                            <row>
                                {/*<h1>{item._id}</h1>*/}
                                <button className= "library-buttons" value={item._id} onClick={(e) => handleFlashcardClick(e.target.value)}>
                                    {item.setname}
                                </button>
                                <button className= "library-buttons" value={item._id} onClick={(e) => handleShowFlashcardsetDeleteConfirm(e.target.value)}>
                                    Delete {item.setname}
                                </button>
                                <button className= "library-buttons" value={item._id} onClick={(e) => handleShowFlashcardsetCopy(e.target.value)}>
                                    Copy {item.setname}
                                </button>
                                <br></br>
                            </row>
                            
                        );
                    })}
                </table>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} dialogClassName="general-box-createflash">
                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                            <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
                                            <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Create Flashcard Set</h2>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <h1></h1>
                                            <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name Of FlashCard Set</label>
                                            <input type="text" name="flashcardSetName" onChange={(e) => setName(e.target.value)} required />
                                            <h1></h1>
                                                <label>Private/Public</label>
                                                <select name="pripub" id="privlist" onChange={(e) => setPrivate(e.currentTarget.value)}>
                                                    <option value={1}>
                                                        Private
                                                    </option>
                                                    <option value={0}>
                                                        Public
                                                    </option>
                                                </select>
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
                                            <Button variant="primary" onClick={handleCreateFlashCardSet}>
                                                Save Changes
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
            <Modal show={showFolderDeleteConfirm} onHide={() => handleCloseFolderDeleteConfirm()}>
                <Modal.Header closeButton={() => handleCloseFolderDeleteConfirm()}>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body> Are you sure you want to delete {library.foldername}?</Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleDeleteFolder(library)}> Delete </Button>
                    <Button onClick={() => handleCloseFolderDeleteConfirm()}> Cancel </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showFlashcardsetDeleteConfirm} onHide={() => handleCloseFlashsetDelCon()}>
                <Modal.Header closeButton={() => handleCloseFlashsetDelCon()}>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body> Are you sure you want to delete {selectedFlashcardsetToDelete.setname}?</Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleDeleteFlashcardset(selectedFlashcardsetToDelete.flashcardset)}> Delete </Button>
                    <Button onClick={() => handleCloseFlashsetDelCon()}> Cancel </Button>
                </Modal.Footer>
            </Modal>    
            <Modal show={showFlashcardsetCopy} onHide={() => handleCloseFlashsetCopy()}>
                <Modal.Header closeButton={() => handleCloseFlashsetCopy()}>
                    <Modal.Title>Copy {selectedFlashcardsetToCopy.setname}</Modal.Title>
                </Modal.Header>
                <Modal.Body> Select where to copy {selectedFlashcardsetToCopy.setname}:
                        {Object.values(currentUser.folder).map(item => {
                            return (
                                <div>
                                    <row>
                                        <label> {item.foldername} </label>
                                        <Button value={item._id} onClick={(e) => handleCopyFlashcardset(e.target.value)}> Copyto </Button>
                                    </row>
                                </div>
                            );
                        })}
                
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleCloseFlashsetCopy()}> Cancel </Button>
                </Modal.Footer>
            </Modal>
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

export default Folder;