import React, { useState } from "react";
import TeacherHeader from "./TeacherHeader.js";
import Achievements from "./Achievements.js";
import HomeLibrary from "./HomeLibrary.js";
import Button from 'react-bootstrap/Button';
import TeacherHomeClasses from './TeacherHomeClasses.js';
import Deletepopup from "./Deletepopup.js";
import { handleShowDelete } from "./Deletepopup.js";
import "./HomePage.css";

function TeacherHomePage() {
    return (
        <div>
            <TeacherHeader/>
            <TeacherHomeClasses/>
        </div>
    );
}

export default TeacherHomePage;