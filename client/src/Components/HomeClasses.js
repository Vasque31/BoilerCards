import React, { useState } from "react";
import "./HomeClasses.css";

function HomeClasses() {

    return (
        <div className="box-classes">
            <h1 className="section-title">My Classes</h1>
            <div className= "home-boxes">
                
                <button className= "block-buttons"><img className= "img-class" src= {require("../images/PurdueTrain.png")} alt="folder"/></button>
                
            </div>
        </div>
    );
}

export default HomeClasses;