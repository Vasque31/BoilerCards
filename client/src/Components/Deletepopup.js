import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

var dummy = {
    foldername: "blank folder",
    setname: "none set",
    front: "blah card",
};
var [deleteObject, setDeleteObject] = [dummy, (e)=>{deleteObject = e;}]; //my usestate for object
var [show, setShow] = [false, (e)=>{show = e;}]; // Modal not shown by default


//from tutorial on Modal
function Deletepopup() {

const handleClose = () => setShow(false); //remove Modal 

const handleDelete = async () => {
    console.log();
    deleteByType(deleteObject); //may have problems due to global var
    setShow(false); //close popup upon deletion
};

return(
<div>

<Modal show={show} onHide={handleClose}>
<Modal.Header closeButton>
    <Modal.Title>Delete Confirmation</Modal.Title>
</Modal.Header>
<Modal.Body> Are you sure you want to delete {getObjectName(deleteObject)}?\n
        {deleteObject}
    </Modal.Body>
<Modal.Footer>
    <Button onClick={handleDelete}> Delete </Button>
    <Button onClick={handleClose}> Cancel </Button>
    </Modal.Footer>
</Modal>

</div>);
}
//invoked on button to show Modal
export const handleShowDelete = async (toDeleteID, type) => {
    //get object
    if (type == "flashcard") {
        
    }
    
    if (type == "flashcardset") {

    }

    if (type == "folder") {

    }
 

    //update popup
    oject.type = type; //set type for other functions
    setDeleteObject(object); //put object 
    setShow(true); //Modal pop-up shows
};

// Works for folder, flashcardset, flashcard
export function getObjectName(object) {


    if (object.type == "flashcard") {
        return object.front; // Assume flashcard front approximates a "name"
    }
    
    if (object.type == "flashcardset") {
        return object.setname;
    } 
    
    if (object.type == "folder") {
        return object.foldername;
    }

    return null;

}

//deletes an element from Flashcard database of any type
async function deleteByType(object) {

    //delete flashcard
    if (object.type = "flashcard") {
        const id = object._id;
        await axios.post("http://localhost:3001/deletFlashcard",{
            flashcardid:id,
        });
        return;
    }

    //delete flashcardset
    if (object.type = "flashcardset") {

    }

    //delete folder
    if (object.foldername == "folder") {

    }
}

export default Deletepopup;