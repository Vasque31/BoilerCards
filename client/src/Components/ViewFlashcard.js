import React, { useState } from "react";
import "./ViewFlashcard.css";
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
import { Link } from "react-router-dom";
//export var flashcardid = null;


export var flashcardid = null;
var toDeleteFlashcard = {
    front: "defaultname flashcard"
};
function ViewFlashcard() {

    const [showEdit, setShowEdit] = useState(false);
    const [update, setUpdate] = useState(JSON.parse(localStorage.getItem('flashcards')));
    const [show, setShow] = useState(false);
    const [showFlashcardDeleteConfirm, setShowFlashcardDeleteConfirm] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [newfront, setNewfront] = useState();
    const [newback, setNewback] = useState();
    const [currSort, setCurrSort] = useState("c_a");
    const [newDiff, setNewDiff] = useState();
    const [showDownload, setShowDownload] = useState(false);
    const handleShowSaved = () => {	setShowSaved(true);	}
    const handleCloseSaved = () => { setShowSaved(false);}
    const handleCloseDownload = () => setShowDownload(false);
    const handleShowDownload = () => setShowDownload(true);
    const handleCloseFlashDelCon = () => {setShowFlashcardDeleteConfirm(false);}
    const handleShowFlashcardDeleteConfirm = async (flashcard_id) => {
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


    const [inputList, setinputList] = useState([{front:'', back:'', drate: '3'}]);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [statePrivate, setPrivate] = useState(update.flashcardset.private);
    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:'', drate:'3'}]);
    }
    const handleeditClick = async (id) => {
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
            newDiff:newDiff,
        });
        console.log(flashcardid);
        handleCloseEdit();
        handlerefresh(update.flashcardset._id);  
             

    }

    const handlerefresh = async (id) => {      
        let res = await axios.post("http://localhost:3001/flsahcardset", {
            setid:id
        });
        localStorage.setItem('flashcards', JSON.stringify(res.data));
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

    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
        console.log(inputList)
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
    const handleSaveFlashcardStatus = async (e) => {
        const updatedflashcardstatus = {
            shared:statePrivate,
            id:update.flashcardset._id
        }
        console.log(updatedflashcardstatus.shared)
        await axios.post("http://localhost:3001/setpublic", {
            status:updatedflashcardstatus,
        })
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

    return (
       
        <div style={{display: 'block', backgroundColor: 'darkgray', width: '100%'}}>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            <div className="test">
            <FlashcardArray cards={cards} containerStyle={{paddingRight: "9rem"}}/>
            </div>
            <div style={{backgroundColor: 'darkgray', width: '100%', height:'70%'}}>
                <Button varient="primary" onClick={(e) => handlerefresh(update.flashcardset._id)}>Refresh</Button>
                <Button varient="primary" onClick={handleShow}>+</Button>
                <Button varient="primary" onClick={handleShowDownload}>Download</Button>
                <Modal show={showDownload} onHide={handleCloseDownload} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Download this Flashcardset</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Once you click Download, press ctrl+p to download locally</Modal.Body>
                    <Modal.Footer>
                        <Link to="/downloadset" target="_blank">
                            <Button varient="primary">Download</Button>
                        </Link>
                    </Modal.Footer>
                </Modal>
                
                {statePrivate &&
                <ToggleButtonGroup type="radio" name="options" defaultValue={true}>
                            <ToggleButton id="private-button" variant="outline-danger" value={true} onChange={e => setPrivate(e.currentTarget.value)}>
                                Private
                            </ToggleButton>
                            <ToggleButton id="public-button" variant="outline-success" value={false} onChange={e => setPrivate(e.currentTarget.value)}>
                                Public
                            </ToggleButton>
                </ToggleButtonGroup> }
                {!statePrivate &&
                <ToggleButtonGroup type="radio" name="options" defaultValue={false}>
                            <ToggleButton id="private-button" variant="outline-danger" value={true} onChange={(e) => setPrivate(e.currentTarget.value)}>
                                Private
                            </ToggleButton>
                            <ToggleButton id="public-button" variant="outline-success" value={false} onChange={(e) => setPrivate(e.currentTarget.value)}>
                                Public
                            </ToggleButton>
                </ToggleButtonGroup> }
                <Button onClick={(handleSaveFlashcardStatus)}>Confirm</Button>
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
                                    <Form.Group style={{color: "gold"}}>
                                        <Form.Label>Difficulty Rating</Form.Label>
                                        <select name ="drate" id="Difficulty-Rating" onChange={(e) => handleinputchange(e,i)}>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option selected value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </select>
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
                        <Form.Group style={{color: "gold"}}>
                            <Form.Label>Difficulty Rating</Form.Label>
                                <select name ="drate" id="Difficulty-Rating" onChange={(e) => setNewDiff(e.target.value)}>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option selected value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </select>
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