import React, { useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function CreateFolder() {
    const [inputList, setinputList] = useState([{front:'', back:''}]);

    return (
        <div className="general-box-create">
            <header style = {{fontSize: "2rem", color:"gold", textAlign: "center"}}>Create Folder</header>
            <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name of Folder</label>
            <input type="text" name="folderName" required />
            <Form>
                <Form.Group style={{paddingTop: "1rem"}}>
                    <Button variant="primary" type="submit">
                        Save New Folder
                    </Button>
                </Form.Group>
            </Form>
            </div>
    );
}

export default CreateFolder;