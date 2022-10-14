import React, { useState } from "react";
import "./ViewFlashcard.css";
import Carousel from 'react-bootstrap/Carousel';
import background from '../images/bk.png';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


function ViewFlashcard() {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };


    return (
        <div style={{display: 'block', backgroundColor: 'darkgray', width: '100%'}}>
            <Carousel activeIndex={index} onSelect={handleSelect}>
            
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
                        <tr>
                            <th>Testing</th>
                            <th>Sample front</th>
                            <th>Sample Back side</th>
                            <th>
                                <ButtonGroup aria-label="Edit/Delete">
                                    <Button variant="primary"> Edit </Button>
                                    <Button variant="primary"> Delete </Button>
                                </ButtonGroup>
                            </th>
                        </tr>
                    </thead>

                </Table>
            </div>
            
        </div>

    );



}

export default ViewFlashcard;