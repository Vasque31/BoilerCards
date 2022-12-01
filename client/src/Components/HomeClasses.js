import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import cookie from 'react-cookie';
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import { useNavigate } from 'react-router-dom';
import "./HomeClasses.css";

function HomeClasses() {
    const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('libdata')))
    const handleClassClick = () => {

    }
    return (
        <div>
            <div style={{fontSize:'2.25rem', paddingTop: '3rem', color:'gold', paddingLeft: '10rem', paddingBottom: '2rem'}}>
                <heading>{getCookie('username')}'s Student HomePage: </heading>
            </div>
            <div className="box-classes">
                <h1 className="section-title">My Classes</h1>
                {/*<table>
                    {Object.values(library.class).map(item => {
                        return (
                            <row>
                                &nbsp; &nbsp;
                                
                                <Button variant='warning' className= "library-buttons" value={item.classCode} onClick= {(e) => handleClassClick(e.target.value)}>
                                    {item.className}
                                </Button>
                                &nbsp; &nbsp;
                            </row>
                        );
                    })}
                </table>*/}
            </div>
        </div>
    );
}

export default HomeClasses;