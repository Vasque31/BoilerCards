import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { cardsQuiz } from "./ViewFlashcard";




function Leaderboard() {

    /*****************************************************
     *      Constants/ Get data                          *
     *                                                   *
     ****************************************************/
    const navigate = useNavigate();


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
    




    return (
        <div>
            <Button onClick={handleCloseLeaderboard}>Exit</Button>
            
        </div>
    )

}
/*
{Object.values().map((entry, index) => {
                return(
                    <div>
                        <p>{index + 1}.</p>
                        <h1>User: {entry.username}</h1> <br></br>
                            <h2> Score: {entry.setid.score}</h2> <br></br>
                            <h3> Time: {entry.setid.time}</h3> <br></br>

                    </div>
                );
            })}
            */
 //Adapted from difficulty sort on backend
 //changes arrays values' ordering in addition to returning an array
 //comp function compares 2 elements, switch if return < 0 (first arg < second arg by convention)
function insertionSort(arr, n, compFunc) 
{ 
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
function compScore() {


}

function compCompletionTime() {

}




export default Leaderboard;