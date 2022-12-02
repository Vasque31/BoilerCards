import React, { useEffect, useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import cookie from 'react-cookies'
export var folder;

function insertionSort(arr, n) {
    let i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j].freq < key.freq) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    
    return arr;
}
function HomeLibrary() {
    const navigate = useNavigate();
    const [cookie, setCookie, removeCookie] = useCookies([]);
    const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('libdata')));
    const [folders, setFolders] = useState([]);
    useEffect(()=> {
        const getLibrary = async () => {
            let res = await axios.post("http://localhost:3001/loadspace", {
                uid:getCookie('userid'),
            });
            
            setLibrary(res.data); 
            
            
            let folders = Object.values(library.folder);
            let n = folders.length;
            //console.log(folders);
            library.folder = insertionSort(folders, n);
            console.log(library.folder);
            setFolders(library.folder);
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
            {folders.slice(0,8).map(item => {
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