
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from "react";

import axios from 'axios';

import "./Leaderboard.css";




function Leaderboard() {

    /*****************************************************
     *      Constants/ Get data                          *
     *                                                   *
     ****************************************************/
    const navigate = useNavigate();
    const [flashcardsetinfo, setFlashcardsetInfo] = useState(JSON.parse(localStorage.getItem('flashcards')));
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(()=> {
        async function getdata() {
            console.log("pre getLeaderboard");
            let res = await axios.post("http://localhost:3001/getLeaderboard", {
                setID: flashcardsetinfo.flashcardset._id,
            });        
            console.log("post getLeaderboard");
            //console.log("resulting data" + res.data);
            var returningArray = res.data;
            setLeaderboard(returningArray);
            console.log(returningArray);
        }
        getdata();
    },[]);
    
    
    
    //var leaderboard = getdata();
    console.log(leaderboard);
    //console.log(getdata().PromiseResult);
    /*****************************************************
     *      Handlers                                     *
     *                                                   *
     ****************************************************/

    const handleCloseLeaderboard = () => {

        navigate(-1);
    };

    const handleShowDetails = () => {

    }






    /*****************************************************
     *      Logic                                        *
     *                                                   *
     ****************************************************/
    
    //latest sort precedence
    //console.log("pre sort");
    //insertionSort(leaderboard, leaderboard.length, compCompletionTime()); //low times sooner
    //insertionSort(leaderboard, leaderboard.length, compScore()); //high scores sooner
    //console.log("post sort");


    return (
        <div>
            <Button className='abort' onClick={handleCloseLeaderboard}>Exit</Button>
            <br></br>
            <div>{leaderboard.map((entry, index) => {
                //Check quiz completion
                if (entry.time != -1) {
                    return(
                        <div className="score-listing">
                            <p >{index + 1}.  User: {entry.userName}</p>
                                <h2>   Score: {entry.score}</h2> 
                                <h3>   Time: {(entry.time - (entry.time % 100))/100}.{(entry.time % 100)/10}sec</h3> <br></br>
                        </div>
                    );
                }

            })}</div>
                   
        </div>
    )

}

 //Adapted from difficulty sort on backend
 //changes arrays values' ordering in addition to returning an array
 //comp function compares 2 elements, switch if return < 0 (first arg < second arg by convention)
function insertionSort(arr, n, compFunc) 
{ 
    console.log("n: " + n);
    if (n <= 1) return arr;
    let i, key, j; 
    for (i = 1; i < n; i++) //element to "insert"
    { 
        key = arr[i]; //current element
        j = i - 1; //element for comparison
        while (j >= 0 && compFunc(arr[j], key) < 0) //iterate through, shifting elements forward till current finds place
        { 
            arr[j + 1] = arr[j]; 
            j = j - 1; 
        } 
        arr[j + 1] = key; //place current ("key") in place of last shifted forward element
    }
  return arr;
}

 //compare score of 2 elements
function compScore(obj1, obj2) {
    console.log("check score");
    if (obj1.score > obj2.score) return -1; //high scores early
    return 1; //do not switch otherwise
}

function compCompletionTime(obj1, obj2) {
    console.log("check time");
    if (obj1.time < obj2.time) return -1; //low times early
    return 1; //do not switch otherwise
}




export default Leaderboard;