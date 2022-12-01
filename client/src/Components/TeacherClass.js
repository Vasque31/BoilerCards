import React, { useEffect, useState } from "react";
import "./TeacherClass.css";
import "./Header.css"
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { useNavigate } from 'react-router-dom';
import TeacherHeader from "./TeacherHeader";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { libstorage } from "./signInPage";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import cookie from 'react-cookies'
import axios from "axios";

function TeacherClass() {
   {/*Create FlashCard Set Handlers*/}
   const fileReader = new FileReader();
   const navigate = useNavigate();
   const [show, setShow] = useState(false);
   const [name, setName] = useState("");
   const [inputList, setinputList] = useState([{front:'', back:'', drate: '3', img:''}]);
   const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('class')))
   const handleaddmore = () => {
    setinputList([...inputList, {front:'', back:'', drate:'3', img: ''}]);
    }
    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
        console.log(inputList)
    }
    const handleCreateFlashCardSet = async(event) => {
        event.preventDefault();

        const flashcardInfo = {
            inputList:inputList,
            name:name,
            classCode:"abc"
        }
        console.log(flashcardInfo);
        let res = await axios.post("http://localhost:3001/createTeacherSet", {
            inputList:flashcardInfo.inputList,
            name:flashcardInfo.name,
            classCode:flashcardInfo.classCode,
        });

        if(res.data===true){
            //handleShowSaved();
        }
        handleClose();
        //handlerefresh();
        console.log(flashcardInfo);
    }
    const handleClose = () => {
        setShow(false);
        setinputList([{front:'', back:'', drate:'3', img:''}]);
    }
    const handleShow = () => setShow(true); 
    const handleimage = (e, i) => {
        const {name} = e.target;
        const list = [...inputList];
        fileReader.onload = r => {
            list[i][name]=r.target.result;
        };
        fileReader.readAsDataURL(e.target.files[0]);
        setinputList(list);
    }
    return (
        <div>
            <TeacherHeader/>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            <div style={{textAlign: 'left', color: 'gold', fontSize: '2rem', paddingLeft: '20rem'}}>
                <heading>Example Class Name</heading>
                <div style ={{fontSize:'1rem', paddingLeft: '3rem', justifyContent: 'flex'}}>Created By: Teacher {getCookie('username')}</div>
            </div>
            <div style={{paddingRight: '32.2rem', textAlign: 'right', color: 'gold'}}>
                &nbsp;&nbsp; Class Code: {getCookie('classCode')}
            </div>

            <div style={{paddingLeft: '25rem', paddingRight: '25rem',display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                <div>
                    <Button variant='light'>Students</Button> 
                    <div style={{paddingTop: '0.25rem'}}>
                    <Button variant='dark' style={{color: 'gold'}} onClick={(e) => setShow(true)}>Create FlashCard Set</Button>
                    </div>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                
                <div className= "teacher-box">
                    
                </div>
            </div>
            <Modal show={show} onHide={handleClose} dialogClassName="general-box-createflash">
                <Modal.Header style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>
                        <h1 style ={{fontSize: "5rem", textAlign: "center"}}>BOILERCARDS</h1>
                        <h2 style ={{fontSize: "2rem", textAlign: "center"}}>Create Flashcard Set</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey',color: "gold"}}>
                    <h1></h1>
                    <label style = {{paddingRight: "1rem", fontSize: "1rem"}}>Name Of FlashCard Set</label>
                    <input type="text" name="flashcardSetName" onChange={(e) => setName(e.target.value)} required />
                    <h1></h1>
                {inputList.map((x,i) => { 
                    return(
                        <Form style={{color: 'gold'}}>
                            <Form.Group>
                                <h1 style={{textAlign: 'left', paddingLeft: '5rem'}}>#{i+1}</h1>
                                <Form.Label>Front of Card</Form.Label>
                                <div>
                                    <textarea type="text" name= "front" placeholder="Front of FlashCard" onChange={e => handleinputchange(e,i)}/>
                                </div>
                            </Form.Group>

                            <Form.Group style={{color: "gold"}}>
                                <Form.Label>Back of Card</Form.Label>
                                <div>
                                    <textarea type="text" name= "back" placeholder="Back of FlashCard" onChange={e => handleinputchange(e,i)} />
                                </div>
                            </Form.Group>
                            <input type='file' name='img' accept="image/png" onChange={(e) => handleimage(e,i)}/>
                            <Form.Group style={{color: "gold"}}>
                            <Form.Label>Difficulty Rating</Form.Label>
                                <select name ="drate" id="Difficulty-Rating" onChange={(e) => handleinputchange(e,i)}>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option selected value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </select>
                            </Form.Group>
                        </Form>
                    );
                    })}
                    <div style={{paddingTop: "1rem"}}>
                        <Button varient= "primary" type="button" onClick={handleaddmore}>
                            Add FlashCard
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black'}}>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateFlashCardSet}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
    </div>
    );
}

export default TeacherClass;