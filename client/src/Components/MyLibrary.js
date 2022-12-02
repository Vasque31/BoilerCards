import React, { useEffect, useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import { libstorage } from "./signInPage";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import cookie from 'react-cookies'
import axios from "axios";

function MyLibrary() {
    const navigate = useNavigate();
    const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('libdata')));
    const [cookie, setCookie, removeCookie] = useCookies([]);
    
    const handleSeeMore = (event) => {
        //prevents page reload
        event.preventDefault();
        navigate("/mylibrary");
        
    };
    const handleFolderClick = async (id) => {
        //prevents page reload
        setCookie('folderid', id, { path: '/' });
        let res = await axios.post("http://localhost:3001/folder", {
            folderid:getCookie('folderid')
        });
        console.log(res.data);
        localStorage.setItem('folder', JSON.stringify(res.data));
        navigate('/folder');
    };

    return (
        <div>
            <Header/>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
        <div className="box">
        <heading className="section-title">My Library</heading>
        <div className= "library-box">
            <table>
            {Object.values(library.folder).map(item => {
                return (
                    <row>
                        &nbsp; &nbsp;
                        {/*<h1>{item._id}</h1>*/}
                        <Button variant='warning' className= "library-buttons" value={item._id} onClick= {(e) => handleFolderClick(e.target.value)}>
                            {item.foldername}
                        </Button>
                        &nbsp; &nbsp;
                    </row>
                );
            })}
            </table>
        </div>
    </div>
    </div>
    );
}

export default MyLibrary;