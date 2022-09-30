import React, { useState } from "react";
import Header from "./Header.js";
import Achievements from "./Achievements.js";
import Button from 'react-bootstrap/Button';
import "./HomePage.css";

function HomePage() {
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
    
        //Call to backend to check validity

    };
    return (
        <div>
            <Header/>
            <Achievements/>
            <div className="box">
                <heading className="section-title">My Library</heading>
                <div style ={{paddingTop: "0.5rem"}}>
                    <Button variant="link" size= "sm" className= "see-more" onChange={handleSeeMore}>See All</Button>
                </div>
                <div className= "library-box">
                    <row>
                        
                        <button className= "library-buttons"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                        <button className= "library-buttons"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                        <button className= "library-buttons"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                        <button className= "library-buttons"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                        <button className= "library-buttons"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                        <button className= "library-buttons"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                        <button className= "library-buttons"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                        <button className= "library-buttons"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                    </row>
                </div>
            </div>
        </div>
    );
}

export default HomePage;