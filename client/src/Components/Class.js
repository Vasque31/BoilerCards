import React, { useEffect, useState } from "react";
import "./TeacherClass.css";
import "./Header.css"
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { libstorage } from "./signInPage";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import cookie from 'react-cookies'
import axios from "axios";

function Class() {
   {/*Create FlashCard Set Handlers*/}
   const fileReader = new FileReader();
   const navigate = useNavigate();
   const [show, setShow] = useState(false);
   const [name, setName] = useState("");
   const [inputList, setinputList] = useState([{front:'', back:'', drate: '3', img:''}]);
   const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('class')));
   const [dest, setDest] = useState(getCookie('classCode'));
   useEffect(() => {
    const getLibrary = async () => {
      let res = await axios.post("http://localhost:3001/class", {
        classCode: getCookie('classCode'),
      });
      console.log(res.data);
      setLibrary(res.data);
      localStorage.setItem("class", JSON.stringify(res.data));
    };
    getLibrary();
  }, []);
   const handleFlashcardSetClick = async(id) => {
    console.log(id);
    let res = await axios.post("http://localhost:3001/flsahcardset", {
        setid:id 
    });
    localStorage.setItem('flashcards', JSON.stringify(res.data));
    console.log(res.data);
    navigate('/restrictedflashcard');
   }
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

    const handlerefresh = async () => {     
        console.log(getCookie('classCode'));
        let res = await axios.post("http://localhost:3001/class", {
            classCode:getCookie('classCode')
        });
        console.log(res.data);
        setLibrary(res.data);
        localStorage.setItem('class', JSON.stringify(res.data));
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
    {/*Student list handlers */}
    const [showStudentList, setShowStudentList] = useState(false);
    const handleLeaveClass = async(id) => {
        let res = await axios.post("http://localhost:3001/leaveClass", {
            userID: getCookie('userid'),
            classCode:getCookie('classCode')
        });
        handlerefresh();
        if (res.data === true) {
            navigate('/HomePage');
            alert("You have left the class");
        }
        
    }
    return (
        <div>
            <Header/>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            <div style={{textAlign: 'left', color: 'gold', fontSize: '2rem', paddingLeft: '20rem'}}>
                <heading>{library.className} - Code: {getCookie('classCode')}</heading>
                <div style ={{fontSize:'1rem', paddingLeft: '3rem', justifyContent: 'flex'}}>Created By: Teacher {library.teacher}</div>
            </div>

            <div style={{paddingLeft: '22rem', paddingRight: '25rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                <div>
                    <Button variant='light' onClick={() => setShowStudentList(true)}>Students</Button> 
                    <div style={{paddingTop: '0.25rem'}}>
                        <Button variant='danger' onClick={() => handleLeaveClass()}>Leave Class</Button> 
                    </div>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                
                <div className= "teacher-box">
                    {Object.values(library.flashcardset).map(item => {
                        return (
                            <div style={{paddingBottom: '0.5rem'}}>
                                &nbsp; &nbsp;
                                {/*<h1>{item._id}</h1>*/}
                                <Button variant='warning' className= "library-buttons" value={item._id} onClick= {(e) => handleFlashcardSetClick(e.target.value)}>
                                    {item.setname}
                                </Button>
                                &nbsp; &nbsp;
                            </div>
                                
                        );
                    })}
                </div>
            </div>

            {/*Student List*/}

            <Modal show={showStudentList} onHide={() => setShowStudentList(false)}>
                <Modal.Header style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>Student List</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}> 
                    {Object.values(library.student).map(item => {
                        return (
                            <div>
                                &nbsp; &nbsp;
                                {/*<h1>{item._id}</h1>*/}
                                <Button variant='warning' className= "library-buttons">
                                    {item}
                                </Button>
                                &nbsp; &nbsp;
                            </div>
                                
                        );
                    })}
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button onClick={() => setShowStudentList(false)}> 
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    </div>
    );
}

export default Class;