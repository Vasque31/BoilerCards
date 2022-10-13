import React, { useEffect, useState } from "react";
import Header from "./Header.js";
import Achievements from "./Achievements.js";
import HomeLibrary from "./HomeLibrary.js";
import Button from 'react-bootstrap/Button';
import HomeClasses from './HomeClasses.js';
import axios from "axios";
import "./HomePage.css";

function HomePage() {
    const [post, setPost] = React.useState(null);
    const uid = "63485bead753983e00dfad58";
    useEffect(() => {
        {/*axios.get("http://localhost:3001/loaduserspace", {uid:"63485bead753983e00dfad58"}).then((response) => {
            console.log(response);
            setPost(response.data);
        });*/}
    }, []);
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