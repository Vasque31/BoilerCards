import React, { useState } from "react";
import "./Achievements.css";

function Achievements() {

    return (
        <div className="box">
            <heading className="section-title">Achievements</heading>
            <div className= "achievement-box">
                <row>
                <button className= "block-achievement"><img src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                </row>
            </div>
        </div>
    );
}

export default Achievements;