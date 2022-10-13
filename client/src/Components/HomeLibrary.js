import React, { useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function HomeLibrary() {
    const navigate = useNavigate();
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate('/mylibrary');
    };
    return (
        <div className="box">
        <h1 className="section-title">My Library</h1>
        <div style ={{paddingTop: "0.5rem"}}>
            <Button variant="link" size= "sm" className= "see-more" onClick={handleSeeMore}>See All</Button>
        </div>
        <div className= "library-box">
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
                <button className= "library-buttons"><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
        </div>
    </div>
    );
}

export default HomeLibrary;