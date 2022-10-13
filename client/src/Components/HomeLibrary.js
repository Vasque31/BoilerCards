import React, { useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';

function HomeLibrary() {
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
    
        //Call to backend to check validity

    };
    return (
        <div className="box">
        <heading className="section-title">My Library</heading>
        <div style ={{paddingTop: "0.5rem"}}>
            <Button variant="link" size= "sm" className= "see-more" onChange={handleSeeMore}>See All</Button>
        </div>
        <div className= "library-box">
            <row>
                
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
            </row>
        </div>
    </div>
    );
}

export default HomeLibrary;