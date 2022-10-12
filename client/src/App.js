import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import SignInPage from "./Components/signInPage.js";
import HomePage from "./Components/HomePage.js";
import Header from './Components/Header.js';
import Settings from "./Components/Settings.js";
import CreateFlashCard from './Components/CreateFlashCard';
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <div  className="App">
      <Routes>
        <Route path="/" element={<SignInPage/>} />

        <Route path="/HomePage" element={<HomePage/>} /> {/*path="/HomePage/:id"*/}

        <Route path="/createflashcardset" element={<CreateFlashCard/>}/>
      </Routes>
    </div>
  );
}

export default App;
