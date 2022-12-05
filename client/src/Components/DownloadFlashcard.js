import React, { useState } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
function DownloadFlashcard() {
    const [flashcards, setFlashcards] = useState(JSON.parse(localStorage.getItem('flashcards')));
    return (
        <div style={{backgroundColor: "white", paddingRight:"10rem", paddingLeft:"10rem"}}>
            <br/><br/>
            <h1 style={{textAlign:"center"}}>BOILERCARDS<br/><br/></h1>
            <Table striped bordered hover style={{paddingRight:"3rem", paddingLeft:"3rem"}}>
                    <thead>
                        <tr>
                            <th>Front</th>
                            <th>Back</th>
                        </tr>
                        {Object.values(flashcards.flashcardarray).map((item, index) => {
                            return (
                                <tr>
                                   
                                    <th>{item.front}</th>
                                    <th>{item.back}</th>
                                    
                                </tr>
                            );
                        })}
                    </thead>

                </Table>
        </div>
    );
}
export default DownloadFlashcard;