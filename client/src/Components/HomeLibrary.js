import React, { useEffect, useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import cookie from 'react-cookies'
export var folder;
function HomeLibrary() {
    const navigate = useNavigate();
    const [cookie, setCookie, removeCookie] = useCookies([]);
    const [library, setLibrary] = useState([]);
    
    useEffect(()=> {
        const getLibrary = async () => {
            let res = await axios.post("http://localhost:3001/loadspace", {
                uid:getCookie('userid'),
            });
            setLibrary(res.data);
        }
        getLibrary();
    },[]);
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate('/mylibrary');
    };
     
    const handleFolderClick = async (id) => {
        //prevents page reload
        setCookie('folderid', id, { path: '/' });
        let res = await axios.post("http://localhost:3001/folder", {
            folderid:getCookie('folderid')
        });
        folder = res.data;
        console.log(res.data);
        navigate('/folder');
    };
    {/*const listOfItems = {libstorage.map((item, index) =>
    <button className= "library-buttons" key={index} onClick={handleFolderClick(item._id)}><img className= "img-library" src= {require("../images/PurdueTrain.png")} alt="lib"/></button>
    )};*/}
    return (
        <div className="box">
        <h1 className="section-title">My Library</h1>
        <div style ={{paddingTop: "0.5rem"}}>
            <Button variant="link" size= "sm" className= "see-more" onClick={handleSeeMore}>See All</Button>
        </div>
        <div className= "library-box">
            {Object.values(library).map(item => {
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