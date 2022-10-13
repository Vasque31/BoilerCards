import React, { useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function MyLibrary() {
    const navigate = useNavigate();
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate("/mylibrary");
        
    };
    return (
        <>
            <div className="box">
                <heading className="section-title">My Library</heading>
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
        </>
    );
}

export default MyLibrary;