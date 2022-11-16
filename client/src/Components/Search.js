import React, { useState } from "react";
import "./Search.css";
import Button from "react-bootstrap/Button";
import Header from "./Header";

function Search() {
    const [results, setResults] = useState(JSON.parse(localStorage.getItem('searchResults')));
    const handleClick = () => {

    }
    
    return (
        <div>
            <Header />
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