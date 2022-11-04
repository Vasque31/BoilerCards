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
            console.log(res.data);
            setLibrary(res.data);
            localStorage.setItem('libdata', JSON.stringify(res.data));
        }
        getLibrary();
    },[]);

    const handleSeeMore = (event) => {
        //prevents page reload
        console.log("It reaches")
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
        localStorage.setItem('folder', JSON.stringify(res.data));
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
            <table>
            {Object.values(library).slice(0,8).map(item => {
                return (
                    <row>
                        &nbsp; &nbsp;
                        {/*<h1>{item._id}</h1>*/}
                        <Button variant="warning" className= "library-buttons" value={item._id} onClick={(e) => handleFolderClick(e.target.value)}>
                            {item.foldername}
                        </Button>
                        &nbsp; &nbsp;
                    </row>
                );
            })}
            </table>
        </div>
    </div>
    );
}

export default HomeLibrary;