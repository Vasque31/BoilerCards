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

export var flashcardid;

function ViewFlashcard() {

    const [index, setIndex] = useState(0);
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


    return (
        <div style={{display: 'block', backgroundColor: 'darkgray', width: '100%'}}>
            <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                <Carousel.Item>
                    <img
                        className="background-1"
                        src={background}
                        alt="First slide"
                        width="100%"
                        height="500px"
                    />
                    
                    <Carousel.Caption >
                        <h3 styling={{fontSize: "5rem", color:"green", textAlign:"center"}}>Front Side of Flashcard</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="background-2"
                        src={background}
                        alt="Second slide"
                        width="100%"
                        height="500px"
                    />
                    <Carousel.Caption>
                        <h2>Back Side of Flashcard</h2>

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
                                    <th>#{index+1}</th>
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