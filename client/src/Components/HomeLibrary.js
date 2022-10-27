import React, { useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { libstorage } from './signInPage';

export var folder;
function HomeLibrary() {
    const navigate = useNavigate();
    const [storage, setStorage] = useState(libstorage);
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
        console.log(libstorage);
        navigate('/mylibrary');
    };
     
    const handleFolderClick = async (id) => {
        //prevents page reload
        console.log(id);
        let res = await axios.post("http://localhost:3001/folder", {
            folderid:id
        });
        folder = res.data;
        console.log(res.data);
        navigate('/folder');
    };
    const handlerefresh = async (e) => {      
        const currentuser = await axios.get("http://localhost:3001/getcuurrentuser");
        let res = await axios.post("http://localhost:3001/loadspace", {
            uid:currentuser.data._id,
        });
        setStorage(res.data);
        console.log(storage);
    }
    {/*const listOfItems = {libstorage.map((item, index) =>
    <button className= "library-buttons" key={index} onClick={handleFolderClick(item._id)}><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
    )};*/}
    return (
        <div className="box">
        <h1 className="section-title">My Library <Button varient="primary" onClick={handlerefresh}>Refresh</Button></h1>
        <div style ={{paddingTop: "0.5rem"}}>
            <Button variant="link" size= "sm" className= "see-more" onClick={handleSeeMore}>See All</Button>
        </div>
        <div className= "library-box">
            {Object.values(storage).map(item => {
                return (
                    <div>
                        {/*<h1>{item._id}</h1>*/}
                        <button className= "library-buttons" value={item._id} onClick={(e) => handleFolderClick(e.target.value)}>
                            {item.foldername}
                        </button>
                    </div>
                );
            })}
        </div>
    </div>
    );
}

export default HomeLibrary;