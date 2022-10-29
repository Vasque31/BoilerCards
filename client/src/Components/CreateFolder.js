import React, { useState } from "react";
import "./CreateFlashCard.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import CloseButton from 'react-bootstrap/CloseButton';
import axios from "axios";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
function CreateFolder() {
    const [folderName, setFoldername] = useState();
    const [cookie, setCookie, removeCookie] = useCookies(['userid']);
    const navigate = useNavigate();
    const handleSave = async (event) => {
        event.preventDefault();
        const currentuser = getCookie('userid');
        console.log(getCookie('userid'));
        let res = await axios.post("http://localhost:3001/createfolder", {
            folderName:folderName, 
            uid:currentuser,      
        });

        if(res){
            alert("success");
            
            let res = await axios.post("http://localhost:3001/loadspace", {
                uid:currentuser,
            });

        }
        console.log(folderName);
        
    }
    return (
        <div className="general-box-create">
            <div style={{textAlign: "left", fontSize: " 1.5rem"}}>
                    <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            <header style = {{fontSize: "2rem", color:"gold", textAlign: "center"}}>Create Folder</header>
            <label style = {{paddingRight: "1rem", color: "gold", fontSize: "1rem"}}>Name of Folder</label>
            <input type="text" name="folderName" onChange={e => setFoldername(e.target.value)} required />
            <Form>
                <Form.Group style={{paddingTop: "1rem"}}>
                    <Button variant="primary" type="submit" onClick={handleSave}>
                        Save New Folder
                    </Button>
                </Form.Group>
            </Form>
        </div>
    );
}

export default CreateFolder;