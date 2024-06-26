import React, { useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router";
import CloseButton from "react-bootstrap/esm/CloseButton";
import { getCookie } from 'react-use-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function CreateFlashCard() {
    const [inputList, setinputList] = useState([{front:'', back:''}]);
    
    const [name, setName] = useState();
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
    const handleSave = async(event) => {
        event.preventDefault();

        const flashcardInfo = {
            inputList:inputList,
            name:name
        }
        let res = await axios.post("http://localhost:3001/createflashcardsethome", {
            inputList:flashcardInfo.inputList,
            name:flashcardInfo.name,
            uid:getCookie("userid"),
        });
        if(res.data===true){
            alert("success");
            navigate('/HomePage');
        }
        
        console.log(flashcardInfo);
    }
    return (
        <>
            <Header/>
        <div className="general-box-create">
        <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
            <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Create Flashcard Set</h2>
            <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name Of FlashCard Set</label>
            <input type="text" name="flashcardSetName" onChange={(e) => setName(e.target.value)} required />
            <DropdownButton id="dropdown-basic-button" title="Destination Folder">
                
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </DropdownButton>

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