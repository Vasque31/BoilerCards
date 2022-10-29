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
            <Deletepopup/>
            <row>
                <Button value={0} onClick={(e) => handleShowDelete(e.target.value, "flashcard")}> Test flashcard delete</Button>
                <Button value={1} onClick={(e) => handleShowDelete(e.target.value, "flashcardset")}> Test flashcardset delete</Button>
                <Button value={2} onClick={(e) => handleShowDelete(e.target.value, "folder")}> Test folder delete</Button>
            </row>
            <Header/>
            <Achievements/>
            <HomeClasses/>
            <HomeLibrary/>
            
        </div>
    );
}

export default HomePage;