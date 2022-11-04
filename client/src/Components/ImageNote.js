import React, { useState } from "react";;

function ImageNote() {
    return (
        
        <div style={{backgroundColor: "white", alignContent: 'center',display: 'flex', textAlign: 'center', justifyContent: 'center'}}>
            <img src={JSON.parse(localStorage.getItem('img'))} alt="No Image Here Bro"/>
        </div>
    );
}
export default ImageNote;