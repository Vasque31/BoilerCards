import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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

const handleDelete = () => {
    console.log()
    setShow(false); //close popup upon deletion
};

return(
<div>

<Modal show={show} onHide={handleClose}>
<Modal.Header closeButton>
    <Modal.Title>Delete Confirmation</Modal.Title>
</Modal.Header>
<Modal.Body> Are you sure you want to delete {getObjectName(deleteObject)}?</Modal.Body>
<Modal.Footer>
    <Button onClick={handleDelete}> Delete </Button>
    <Button onClick={handleClose}> Cancel </Button>
    </Modal.Footer>
</Modal>

</div>);
}
//invoked on button to show Modal
export const handleShowDelete = async (toDelete) => {
    setDeleteObject(toDelete);
    console.log(toDelete+"\n");
    console.log(deleteObject+"\n");
    /*const elementObject = document.getElementById('deletename');
    elementObject.innerHTML = getObjectName(deleteObject);*/
    setShow(true); //Modal pop-up
};

// Works for folder, flashcardset, flashcard
export function getObjectName(object) {


    if (object.front != null) {
        return object.front; // Assume flashcard front approximates a "name"
    }
    
    if (object.setname != null) {
        return object.setname;
    } 
    
    if (object.foldername != null) {
        return object.foldername;
    }

    return null;

}

//deletes an element from Flashcard database of any type
function deleteByType(object) {

    //delete flashcard
    if (object.front != null) {

    }

    //delete flashcardset
    if (object.setname != null) {

    }

    //delete folder
    if (object.foldername != null) {

    }
}

export default Deletepopup;