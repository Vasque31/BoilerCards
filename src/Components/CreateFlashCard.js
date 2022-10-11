import React, { useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function CreateFlashCard() {
    const [inputList, setinputList] = useState([{front:'', back:''}]);

    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:''}]);
    }

    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
    }
    return (
        <div className="general-box-create">
            <header style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</header>
            <header style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Create Flashcard Set</header>
            <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name Of FlashCard Set</label>
            <input type="text" name="flashcardSetName" required />
            {
            inputList.map((x,i) => {
                return(
                <Form>
                    <Form.Group style={{color: "gold"}}>
                        <h1>#{i+1}</h1>
                        <Form.Label>Front of Card</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" onChange={e => handleinputchange(e,i)}/>
                    </Form.Group>

                    <Form.Group style={{color: "gold"}}>
                        <Form.Label>Back of Card</Form.Label>
                        <Form.Control type="text" placeholder="Password" onChange={e => handleinputchange(e,i)} />
                    </Form.Group>
                    <Form.Group style={{paddingTop: "1rem"}}>
                        <Button varient= "primary" type="button" onClick={handleaddmore}>Add FlashCard</Button>
                    </Form.Group>

                    <Form.Group style={{paddingTop: "1rem"}}>
                        <Button variant="primary" type="submit">
                            Save FlashCard Set
                        </Button>
                    </Form.Group>
                </Form>
                );
            })}
        </div>
    );
}

export default CreateFlashCard;