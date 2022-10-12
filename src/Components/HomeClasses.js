import React, { useState } from "react";
import "./HomeClasses.css";

function HomeClasses() {

    return (
        <div className="box-classes">
            <heading className="section-title">My Classes</heading>
            <div className= "home-boxes">
                <row>
                <button className= "block-buttons"><img className= "img-class" src= {require("../images/PurdueTrain.png")} alt="folder"/></button>
                </row>
            </div>
        </div>
    );
}

export default HomeClasses;