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
export var flashcardid;


function ViewFlashcard() {

    const [index, setIndex] = useState(0);
    const [front, setFront] = useState();
    const [back, setBack] = useState();
    const navigate = useNavigate();

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const handleeditClick = async (id) => {
        console.log(id);
        console.log(flashcards);
        flashcardid = id;
        navigate("/editflashcard");

    }
    const handledeleteClick = async (id) => {
        await axios.post("http://localhost:3001/deletFlashcard",{
            flashcardid:id,
        });
    }

    const handleselectClick = (item) => {
        setFront(item.front);
        setBack(item.back);
        console.log(item);
        console.log(front);
        console.log(back);
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
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Flashcard</th>
                            <th>Front</th>
                            <th>Back</th>
                            <th>Edit or Delete</th>
                        </tr>
                        {flashcards.flashcardarray.map((item, index) => {
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