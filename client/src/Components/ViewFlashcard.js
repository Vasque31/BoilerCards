import React, { useState } from "react";
import "./ViewFlashcard.css";
import Carousel from 'react-bootstrap/Carousel';
import background from '../images/bk.png';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { flashcards } from "./Folder.js";
import { useNavigate } from "react-router";
import axios from 'axios';
import CloseButton from "react-bootstrap/esm/CloseButton";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import saveicon from "../images/saveicon.png";
import Dropdown from "react-bootstrap/Dropdown";
import { FlashcardArray } from "react-quizlet-flashcard";
//export var flashcardid = null;


export var flashcardid = null;
var toDeleteFlashcard = {
    front: "defaultname flashcard"
};

function ViewFlashcard() {
    const [showEdit, setShowEdit] = useState(false);
    const [update, setUpdate] = useState(flashcards);
    const [show, setShow] = useState(false);
    const [showFlashcardDeleteConfirm, setShowFlashcardDeleteConfirm] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [newfront, setNewfront] = useState();
    const [newback, setNewback] = useState();
    const [currSort, setCurrSort] = useState("c_a");
    const handleShowSaved = () => {	setShowSaved(true);	}
    const handleCloseSaved = () => { setShowSaved(false);}
    const handleCloseFlashDelCon = () => {setShowFlashcardDeleteConfirm(false);}

    const handleShowFlashcardDeleteConfirm = async (id) => {
        let res =await axios.post("http://localhost:3001/flsahcard",{
            flashcardid: flashcard_id
        });
        toDeleteFlashcard = res.data;
        setShowFlashcardDeleteConfirm(true);
    }
    const handleDeleteFlashcard = async (flashcard) => {
        const id = flashcard._id;
        let res = await axios.post("http://localhost:3001/deletFlashcard",{
            flashcardid:id,
        });

        handlerefresh(update.flashcardset._id);

        if (res.data == true) {
            handleCloseFlashDelCon();
            handleShowSaved();
        }
        
    }


    const [inputList, setinputList] = useState([{front:'', back:''}]);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [statePrivate, setPrivate] = useState(false);
    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:''}]);
    }
    const handleeditClick = async (id) => {

        
        /*let res = await axios.post("http://localhost:3001/edit", {

            flashcardid:id
       
        });
        setShowEdit(true);
        flashcardid = id;
        
    }
    const handleCloseEdit = () => {
        setShowEdit(false);
    }
    const handleSaveEdit = async(event) => {

        handlerefresh(update.flashcardset._id);

        let res = await axios.post("http://localhost:3001/edit", {
            flashcardid:flashcardid,
            newfront:newfront,
            newback:newback,
        });
        handleCloseEdit();
        handlerefresh(update.flashcardset._id);   
             

    }


    const handlerefresh = async (id) => {      
        let res = await axios.post("http://localhost:3001/flsahcardset", {
            setid:id
        });
        update.flashcardarray = res.data.flashcardarray;
        update.sortedarray = res.data.sortedarray;
        update.flashcard_id = res.data.flashcard_id;
        if (currSort === "c_a") {
            setCards("creation", true);
        } else if (currSort === "c_d") {
            setCards("creation", false);
        } else if (currSort === "d_a") {
            setCards("diff", true);
        } else if (currSort === "d_d") {
            setCards("diff", false);
        }
    }
    const handleChangePrivate = () => {
        {/*statePrivate*/}
        /*let res = await axios.post("http://localhost:3001/edit", {
            flashcardid:id
       
        });*/
    }

    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
    }
    const handleSave = async(event) => {
        event.preventDefault();
        let res = await axios.post("http://localhost:3001/addmoreFlashcards", {
            inputList:inputList,
            setid:update.flashcardset._id
        });
        if (res.data == true) {
            handleClose();
            handlerefresh(update.flashcardset._id);
        }
    }
    const handleSaveFlashcardStatus = (e) => {
        const updatedflashcardstatus = {
            shared:statePrivate,
            id:update._id
        }

    }
    let temp = [];
    for (let i = 0; i < Object.values(update.flashcardarray).length; i++) {
        let idnum = i;
        let front = Object.values(update.flashcardarray)[i].front;
        let back = Object.values(update.flashcardarray)[i].back;
        let flashcard_id = Object.values(update.flashcardarray)[i]._id;
        temp.push({id: idnum, front: front, back: back, flashcard_id: flashcard_id});
    }
    const [cards, setCard] = useState(temp);

    
    const setCards = (arr, ascending) => {
        let new_cards = [];
        if (arr === "creation" && ascending) {
            for (let i = 0; i < Object.values(update.flashcardarray).length; i++) {
                let idnum = i;
                let front = Object.values(update.flashcardarray)[i].front;
                let back = Object.values(update.flashcardarray)[i].back;
                let flashcard_id = Object.values(update.flashcardarray)[i]._id;
                new_cards.push({id: idnum, front: front, back: back, flashcard_id: flashcard_id});
                setCurrSort("c_a");
            }
        } else if (arr === "creation" && !ascending) {
            for (let i = 0; i < Object.values(update.flashcardarray).length; i++) {
                let idnum = i;
                let front = Object.values(update.flashcardarray)[Object.values(update.flashcardarray).length - i - 1].front;
                let back = Object.values(update.flashcardarray)[Object.values(update.flashcardarray).length - i - 1].back;
                let flashcard_id = Object.values(update.flashcardarray)[Object.values(update.flashcardarray).length - i - 1]._id;
                new_cards.push({id: idnum, front: front, back: back, flashcard_id: flashcard_id});
                setCurrSort("c_d");
            }
        } else if (arr === "diff" && ascending) {
            for (let i = 0; i < Object.values(update.sortedarray).length; i++) {
                let idnum = i;
                let front = Object.values(update.sortedarray)[Object.values(update.sortedarray).length - i - 1].front;
                let back = Object.values(update.sortedarray)[Object.values(update.sortedarray).length - i - 1].back;
                let flashcard_id = Object.values(update.sortedarray)[Object.values(update.sortedarray).length - i - 1]._id;
                new_cards.push({id: idnum, front: front, back: back, flashcard_id: flashcard_id});
                setCurrSort("d_a");
            }
        } else {
            for (let i = 0; i < Object.values(update.sortedarray).length; i++) {
                let idnum = i;
                let front = Object.values(update.sortedarray)[i].front;
                let back = Object.values(update.sortedarray)[i].back;
                let flashcard_id = Object.values(update.sortedarray)[i]._id;
                new_cards.push({id: idnum, front: front, back: back, flashcard_id: flashcard_id});
                setCurrSort("d_d");
            }
        }
        setCard(new_cards);
    }
    //setCards(update.flashcardarray, true);
    const setSort = (e) => {
        if (e === "creation_date_ascend") {
            setCards("creation", true);
        } else if (e === "creation_date_desc") {
            setCards("creation", false);
        } else if (e === "diff_ascend") {
            setCards("diff", true);
        } else if (e === "diff_desc") {
            setCards("diff", false);
        }
        
    }
    const handleDownload = (event) => {
        event.preventDefault();
        let output = '';
        for (let i = 0; i < Object.values(update.flashcardarray).length; i++) {
            output += Object.values(update.flashcardarray)[i].front;
            output += "\t";
            output += Object.values(update.flashcardarray)[i].back;
            output += "\n";
        }
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState ({})

    }
    return (
        
        <div style={{display: 'block', backgroundColor: 'darkgray', width: '100%'}}>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            
            
            
            <FlashcardArray cards={cards} containerStyle={{paddingRight: "9rem"}}/>

            <div style={{backgroundColor: 'darkgray', width: '100%', height:'70%'}}>
                <Button varient="primary" onClick={(e) => handlerefresh(update.flashcardset._id)}>Refresh</Button>
                <Button varient="primary" onClick={handleShow}>+</Button>
                <Button varient="primary">Download</Button>
                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                            <ToggleButton id="private-button" variant="outline-danger" value={1} onClick={(e) => setPrivate(e.currentTarget.value)}>
                                Private
                            </ToggleButton>
                            <ToggleButton id="public-button" variant="outline-success" value={0} onClick={(e) => setPrivate(e.currentTarget.value)}>
                                Public
                            </ToggleButton>
                </ToggleButtonGroup>
                <Button onClick={(handleChangePrivate)}>Confirm</Button>
                <Dropdown as={ButtonGroup}>
                    <Button variant="secondary">Sort By:</Button>
                    <Dropdown.Toggle split variant="secondary" id = "dropdown-split-basic" />

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => setSort("creation_date_ascend")}>
                            Creation Date Ascending
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setSort("creation_date_desc")}>
                            Creation Date Descending
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setSort("diff_ascend")}>
                            Difficulty Ascending
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setSort("diff_desc")}>
                            Difficulty Descending
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Modal show={show} onHide={handleClose} dialogClassName="general-box-createflash">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1 style = {{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
                        <h2 style = {{fontSize: "2rem", color:"gold", textAlign: "center"}}>Add New Flashcards</h2>
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {
                        inputList.map((x,i) => {
                            return(
                                <Form>
                                    <Form.Group style={{color: "gold"}}>
                                        <h1>#{i+1}</h1>
                                        <Form.Label>Front of Card</Form.Label>
                                        <Form.Control type="text" name = "front" placeholder="Front of FlashCard" onChange={e =>handleinputchange(e,i)}/>
                                    </Form.Group>
                                    
                                    <Form.Group style={{color: "gold"}}>
                                        <Form.Label>Back of Card</Form.Label>
                                        <Form.Control type="text" name= "back" placeholder="Back of FlashCard" onChange={e => handleinputchange(e,i)} />
                                    </Form.Group>
                                </Form>
                            )
                        })
                    }
                        <div style={{paddingTop: "1rem"}}>
                            <Button varient="primary" type = "button" onClick={handleaddmore}>
                                Add Flashcard
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
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Flashcard</th>
                            <th>Front</th>
                            <th>Back</th>
                            <th>Edit or Delete</th>
                        </tr>
                        {cards.map((item, index) => {
                            return (
                                <tr>
                                    
                                    <th>
                                        <Button variant="light"> #{index+1} </Button>
                                    </th>
                                    <th>{item.front}</th>
                                    <th>{item.back}</th>
                                    <th>
                                        <ButtonGroup aria-label="Edit/Delete">
                                            <Button variant="primary" value={item.flashcard_id} onClick={(e) => handleeditClick(e.target.value)}> Edit </Button>
                                            <Button variant="primary" value={item.flashcard_id} onClick={(e) => handleShowFlashcardDeleteConfirm(e.target.value)}> Delete </Button>
                                        </ButtonGroup>
                                    </th>
                                </tr>
                            );
                        })}
                    </thead>

                </Table>
            </div>
            <Modal show={showEdit} onHide = {handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1 style = {{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
                        <h2 style = {{fontSize: "2rem", color:"gold", textAlign: "center"}}>Edit Flashcards</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group style={{color: "gold"}}>
                            <Form.Label>Front of Card</Form.Label>
                            <Form.Control type="text" name= "front" placeholder="Front of FlashCard" onChange={e => setNewfront(e.target.value)}/>
                        </Form.Group>

                        <Form.Group style={{color: "gold"}}>
                            <Form.Label>Back of Card</Form.Label>
                            <Form.Control type="text" name= "back" placeholder="Back of FlashCard" onChange={e => setNewback(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showFlashcardDeleteConfirm} onHide={() => handleCloseFlashDelCon()}>
                <Modal.Header closeButton={() => handleCloseFlashDelCon()}>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body> Are you sure you want to delete {toDeleteFlashcard.front}?</Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleDeleteFlashcard(toDeleteFlashcard)}> Delete </Button>
                    <Button onClick={() => handleCloseFlashDelCon()}> Cancel </Button>
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

export default ViewFlashcard;