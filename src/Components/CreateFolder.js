import React, { useState } from "react";
import "./CreateFolder.css";

function CreateFolder() {

    const handleCreation = (event) => {
        event.preventDefault();
        
    }
    return (
        <div className='CreateFolder'>
            <h1> Creating a Folder </h1>
            <div>
                <form action = "/url"> 
                    <label for = "folderName">Name: </label>
                    <input type = "text" id = "folderName" name = "folderName"> <br></br> </input>
                    <input type = "submit" value = "Submit"></input>

                </form>


            </div>

        </div>
  

    );
}
export default CreateFolder;
