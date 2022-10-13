import React, { useState } from "react";
import "./ViewFlashcard.css";
import Carousel from 'react-bootstrap/Carousel';
import background from '../images/PurdueTrain.png';
function ViewFlashcard() {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };


    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            
            <Carousel.Item>
                <img
                    className="background-1"
                    src={background}
                    alt="First slide"
                />
                <Carousel.Caption >
                    <h1 styling={{fontSize: "5rem", color:"green", textAlign:"center"}}>Front Side of Flashcard</h1>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="background-2"
                    src={background}
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <h2>Back Side of Flashcard</h2>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );


}

export default ViewFlashcard;