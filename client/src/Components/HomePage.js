import React, { useState } from "react";
import Header from "./Header.js";
import Achievements from "./Achievements.js";
import HomeLibrary from "./HomeLibrary.js";
import Button from 'react-bootstrap/Button';
import HomeClasses from './HomeClasses.js';
import Deletepopup from "./Deletepopup.js";
import { handleShowDelete } from "./Deletepopup.js";
import "./HomePage.css";

function HomePage() {
    return (
        <div>
        
            <Header/>
            <HomeClasses/>
            <HomeLibrary/>
            
        </div>
    );
}

export default HomePage;