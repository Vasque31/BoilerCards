import React, { useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import { libstorage } from "./signInPage";
import axios from "axios";

function MyLibrary() {
    const navigate = useNavigate();
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate("/mylibrary");
        
    };

    return (
        
        <div className="box">
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
        <h1 className="section-title">My Library</h1>
        <div style ={{paddingTop: "0.5rem"}}>
            <Button variant="link" size= "sm" className= "see-more" onClick={handleSeeMore}>See All</Button>
        </div>
        <div className= "library-box">
            {libstorage.map(item => {
                return (
                    <div>
                        {/*<h1>{item._id}</h1>*/}
                        <button className= "library-buttons" value={item._id}>
                            {item.foldername}
                        </button>
                    </div>
                );
            })}
        </div>
    </div>
    );
}

export default MyLibrary;