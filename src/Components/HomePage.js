import React, { useState } from "react";
import Header from "./Header.js";
import Achievements from "./Achievements.js";
import HomeLibrary from "./HomeLibrary.js";
import Button from 'react-bootstrap/Button';
import HomeClasses from './HomeClasses.js';
import "./HomePage.css";
import CreateFolder from './CreateFolder';
function HomePage() {
    return (
        <div>

            <Header/>
            <Achievements/>
            <HomeClasses/>
            <HomeLibrary/>           
        </div>
    );
}

export default HomePage;