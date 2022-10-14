import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import SignInPage from "./Components/signInPage.js";
import HomePage from "./Components/HomePage.js";
import Header from './Components/Header.js';
import Settings from "./Components/Settings.js";
import CreateFlashCard from './Components/CreateFlashCard';
import RegistrationPage from './Components/RegistrationPage';
import { Route, Routes } from "react-router-dom";
import CreateFolder from './Components/CreateFolder';
import MyLibrary from './Components/MyLibrary';
import SavedIcon from './Components/SavedIcon';
import ChangeCredentials from './Components/ChangeCredentials';

function App() {
  return (
    <div  className="App">
      <Routes>
        <Route path="/" element={<SignInPage/>} />

        <Route path="/register" element={<RegistrationPage/>} />
        <Route path="/HomePage" element={<HomePage/>} /> {/*path="/HomePage/:id"*/}
        <Route path="/mylibrary" element={<MyLibrary/>} />
        <Route path="/settings" element={<Settings/>} />

        <Route path="/createflashcardset" element={<CreateFlashCard/>}/>
        <Route path="/createfolder" element={<CreateFolder/>} />
        <Route path="/changecredentials" element={<ChangeCredentials/>} />

        <Route path="/saveicon" element={<SavedIcon/>} />

      </Routes>
    </div>
  );
}

export default App;
