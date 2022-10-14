import React, { useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import {folder} from './HomeLibrary';
import axios from 'axios';


export var flashcards = null;

function Folder() {
    const navigate = useNavigate();
    const handleFlashcardClick = async (id) => {
        //prevents page reload
        console.log(id);
        let res = await axios.post("http://localhost:3001/flsahcardset", {
            setid:id
        });
        flashcards = res.data;
        console.log(flashcards);
        navigate('/flashcard');
    };
    return (
        <>
            <Header/>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            <div className="box">
                <heading className="section-title">{folder.folder.foldername}</heading>
                <div className= "library-box">
                    {folder.setarray.map(item => {
                        return (
                            <div>
                                {/*<h1>{item._id}</h1>*/}
                                <button className= "library-buttons" value={item._id} onClick={(e) => handleFlashcardClick(e.target.value)}>
                                    {item.setname}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Folder;