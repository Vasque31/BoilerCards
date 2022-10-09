import React, { useState } from "react";
import "./Achievements.css";

function Achievements() {

    return (
        <div className="box-achievement">
            <heading className="section-title">Achievements</heading>
            <div className= "achievement-box">
                <row>
                <button className= "block-achievement"><img className= "img-achievement" src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
                </row>
            </div>
        </div>
    );
}

export default Achievements;