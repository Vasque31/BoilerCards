import React, { useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

function MyLibrary() {
    const navigate = useNavigate();
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate("/mylibrary");
        
    };
    return (
        <>
            <Header/>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
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