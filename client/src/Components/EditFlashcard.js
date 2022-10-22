import React, { useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {flashcardid} from "./ViewFlashcard";
import CloseButton from "react-bootstrap/esm/CloseButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditFlashcard() {
    const newflashcard = flashcardid;
    const [newfront, setNewfront] = useState();
    const [newback, setNewback] = useState();
    const navigate = useNavigate();
    
    const handleSave = async(event) => {
    	console.log(newfront);
    	console.log(flashcardid);
    	console.log(newback);
    
        await axios.post("http://localhost:3001/edit", {
            flashcardid:newflashcard,
            newfront:newfront,
            newback:newback,
        });
        console.log("success");
        alert("success");
    }

    return (
        <div className="general-box-create">
         <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
        <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Edit Flashcard</h2>
        <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
        <Form>
            <Form.Group style={{color: "gold"}}>
                <Form.Label>Front of Card</Form.Label>
                <Form.Control type="text" name= "front" placeholder="Front of FlashCard" onChange={e => setNewfront(e.target.value)}/>
            </Form.Group>

            <Form.Group style={{color: "gold"}}>
                <Form.Label>Back of Card</Form.Label>
                <Form.Control type="text" name= "back" placeholder="Back of FlashCard" onChange={e => setNewback(e.target.value)}/>
            </Form.Group>
        </Form>
        <div style={{paddingTop: "1rem"}}>
                <Button variant="primary" type="submit" onClick={handleSave}>
                    Save FlashCard
                </Button>
        </div>
        </div>
    );
}

export default EditFlashcard;