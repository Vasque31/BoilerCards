import React, { useState } from "react";
import "./Achievements.css";

function Achievements() {

    return (
        <div className="box-achievement">
            <h1 className="section-title">Achievements</h1>
            <div className= "achievement-box">
                <button className= "block-achievement"><img className= "img-achievement" src= {require("../images/PurdueTrain.png")} alt="my image"/></button>
            </div>
        </div>
    );
}

export default Achievements;