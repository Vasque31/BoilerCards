import React, { useState } from "react";
import "./Search.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Header from "./Header";
import TeacherHeader from "./TeacherHeader";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import { useNavigate } from "react-router-dom";

function Search() {
    const navigate = useNavigate();
    const [results, setResults] = useState(JSON.parse(localStorage.getItem('searchResults')));
    const handleClick = async(id) => {

            console.log(id);
            let res = await axios.post("http://localhost:3001/flsahcardset", {
                setid:id 
            });
            localStorage.setItem('flashcards', JSON.stringify(res.data));
            console.log(res.data);
            navigate('/restrictedflashcard');

    }
    
    return (
        <div>
            {getCookie("teacher") !== "true" && <Header />}
            {getCookie("teacher") === "true" && <TeacherHeader />}
            <div style={{padding: '10rem', paddingLeft: '36rem', paddingRight: '36rem', justifyContent:'flex'}}>
                <div style={{fontSize: '2.5rem',color:"gold"}}>
                    Search Results
                </div>
            <div className="search-box">
                ---Flashcard Sets---
                {Object.values(results).map((item, i) => {
                    return (
                        <div style={{color:'gold', fontSize: '1rem'}}>
                            &nbsp; &nbsp;
                            #{i+1} <button variant='warning' className= "library-buttons" value={item._id} onClick= {(e) => handleClick(e.target.value)}>
                                {item.setname}
                            </button>
                            &nbsp; &nbsp;
                        </div>
                    );
                })}
            </div>
            </div>
        </div>
    );
}

export default Search;