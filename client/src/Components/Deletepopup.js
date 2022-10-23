import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



//from tutorial on Modal
function Deletepopup() {

const [show, setShow] = useState(false); // Modal not shown by default
const handleClose = () => setShow(false); //remove Modal 
const handleShow = () => setShow(true); //Modal pop-up
const handleDelete = () => {

    setShow(false); //close popup upon deletion
};

return(
<div>
//Delete Button
<Modal show={show} onHide={handleClose}>
<Modal.header closeButton>
    <Modal.title>Delete Confirmation</Modal.title>
</Modal.header>

</Modal>

</div>);
}