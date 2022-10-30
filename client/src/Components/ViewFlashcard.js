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
export var flashcardid = null;


function ViewFlashcard() {
    const [index, setIndex] = useState(0);
    const [front, setFront] = useState();
    const [back, setBack] = useState();
    const [update, setUpdate] = useState(flashcards);
    const [show, setShow] = useState(false);
    const [inputList, setinputList] = useState([{front:'', back:''}]);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [statePrivate, setPrivate] = useState(false);
    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:''}]);
    }
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const handleeditClick = async (id) => {
        console.log(id);
        /*let res = await axios.post("http://localhost:3001/edit", {
            flashcardid:id
       
        });*/
        
        flashcardid = id;
        console.log(flashcards);
        flashcardid = id;
        navigate("/editflashcard");

    }

    const handlerefresh = async (id) => {      
        let res = await axios.post("http://localhost:3001/flsahcardset", {
            setid:id
        });
        setUpdate(res.data);
    }
    const handledeleteClick = (id) => {
        console.log(id);
    }

    const handleselectClick = (item) => {
        setFront(item.front);
        setBack(item.back);
        console.log(item);
        console.log(front);
        console.log(back);
    }
    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
    }
    const handleSave = async(event) => {
        console.log("something");
    }
    const handleSaveFlashcardStatus = (e) => {
        const updatedflashcardstatus = {
            shared:statePrivate,
            id:update._id
        }

    }
    return (
        
        <div style={{display: 'block', backgroundColor: 'darkgray', width: '100%'}}>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            
            <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                
                <Carousel.Item>
                    <img
                        className="background-1"
                        src={background}
                        alt="Sides"
                        width="100%"
                        height="500px"/>
                    <Carousel.Caption>
                        <h3>{front}</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="background-2"
                        src={background}
                        alt="Sides"
                        width="100%"
                        height="500px"/>
                    <Carousel.Caption>
                        <h3>{back}</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            

            </Carousel>
            
            <div style={{backgroundColor: 'darkgray', width: '100%', height:'70%'}}>
                <Button varient="primary" onClick={handlerefresh(update.flashcardset._id)}>Refresh</Button>
                <Button varient="primary" onClick={handleShow}>+</Button>
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
                        <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                            <ToggleButton id="private-button" variant="outline-danger" value={1} onClick={(e) => setPrivate(e.currentTarget.value)}>
                                Private
                            </ToggleButton>
                            <ToggleButton id="public-button" variant="outline-success" value={0} onClick={(e) => setPrivate(e.currentTarget.value)}>
                                Public
                            </ToggleButton>
                        </ToggleButtonGroup>
                        {Object.values(update.flashcardarray).map((item, index) => {
                            return (
                                <tr>
                                    <th>
                                        <Button variant="light" value={item} onClick={(e) => handleselectClick(item)}> #{index+1} </Button>
                                    </th>
                                    <th>{item.front}</th>
                                    <th>{item.back}</th>
                                    <th>
                                        <ButtonGroup aria-label="Edit/Delete">
                                            <Button variant="primary" value={item._id} onClick={(e) => handleeditClick(e.target.value)}> Edit </Button>
                                            <Button variant="primary" value={item._id} onClick={(e) => handledeleteClick(e.target.value)}> Delete </Button>
                                        </ButtonGroup>
                                    </th>
                                </tr>
                            );
                        })}
                    </thead>

                </Table>
            </div>
            
        </div>

    );



}

export default ViewFlashcard;