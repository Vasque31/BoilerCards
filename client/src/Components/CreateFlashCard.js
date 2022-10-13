import React, { useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function CreateFlashCard() {
    const [inputList, setinputList] = useState([{front:'', back:''}]);
    const navigate = useNavigate();
    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:''}]);
    }

    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
    }
    const handleSave = async (event) => {
	 
        event.preventDefault();

	  const flashcardset = {
		
	  }

        console.log(inputList);
//	let res = await axios.post("http://localhost:5000/createflashcardset", {
//          flashcardset,
//        });  //Check database operations

	let validOperation = true; //replace with response from database
	if(validOperation) {
	  navigate('/saveicon');
	} else {
	  alert("Not saved");
	}
    }
    return (
        <>
            <Header/>
        <div className="general-box-create">
            <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
            <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Create Flashcard Set</h2>
            <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name Of FlashCard Set</label>
            <input type="text" name="flashcardSetName" required />
            {
            inputList.map((x,i) => { 
                return(
                <Form>
                    <Form.Group style={{color: "gold"}}>
                        <h1>#{i+1}</h1>
                        <Form.Label>Front of Card</Form.Label>
                        <Form.Control type="text" name= "front" placeholder="Front of FlashCard" onChange={e => handleinputchange(e,i)}/>
                    </Form.Group>

                    <Form.Group style={{color: "gold"}}>
                        <Form.Label>Back of Card</Form.Label>
                        <Form.Control type="text" name= "back" placeholder="Back of FlashCard" onChange={e => handleinputchange(e,i)} />
                    </Form.Group>
                </Form>
                );
            })}
            <div style={{paddingTop: "1rem"}}>
                <Button varient= "primary" type="button" onClick={handleaddmore}>
                    Add FlashCard
                </Button>
            </div>

            <div style={{paddingTop: "1rem"}}>
                <Button variant="primary" type="submit" onClick={handleSave}>
                    Save FlashCard Set
                </Button>
            </div>
        </div>
        </>
    );
}

export default CreateFlashCard;