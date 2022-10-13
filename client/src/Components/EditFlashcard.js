import React, { useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function EditFlashcard() {
    const handleSave = (event) => {

    }

    return (
        <div className="general-box-create">
         <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
        <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Edit Flashcard</h2>
        <Form>
            <Form.Group style={{color: "gold"}}>
                <Form.Label>Front of Card</Form.Label>
                <Form.Control type="text" name= "front" placeholder="Front of FlashCard" />
            </Form.Group>

            <Form.Group style={{color: "gold"}}>
                <Form.Label>Back of Card</Form.Label>
                <Form.Control type="text" name= "back" placeholder="Back of FlashCard" />
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