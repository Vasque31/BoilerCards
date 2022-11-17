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
import Folder from './Components/Folder';
import ViewFlashCard from './Components/ViewFlashcard.js'
import EditFlashcard from './Components/EditFlashcard';
import DownloadFlashcard from "./Components/DownloadFlashcard";
import { useCookies } from 'react-cookie';
import QuizGame from './Components/QuizGame.js';
import ImageNote from './Components/ImageNote.js';
import Search from './Components/Search';

function App() {

  return (
    <div  className="App">
      <Routes>
        <Route path="/" element={<SignInPage/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/register" element={<RegistrationPage/>} />
        <Route path="/HomePage" element={<HomePage/>} /> {/*path="/HomePage/:id"*/}
        <Route path="/mylibrary" element={<MyLibrary/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/folder" element={<Folder/>} />
        <Route path="/createflashcardset" element={<CreateFlashCard/>}/>
        <Route path="/changecredentials" element={<ChangeCredentials/>} />
        <Route path="/flashcard" element={<ViewFlashCard/>} />
        <Route path="/editflashcard" element={<EditFlashcard/>} />
        <Route path="/saveicon" element={<SavedIcon/>} />
        <Route path="/downloadset" element={<DownloadFlashcard/>} />
        <Route path="/note" element={<ImageNote/>} />
        <Route path="/quizgame" element={<QuizGame/>} />

      </Routes>
    </div>
  );
}

export default App;