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
import QuizSelect from './Components/QuizSelect.js';
import TypedQuiz from './Components/TypedQuiz.js';
import Leaderboard from './Components/Leaderboard.js';
import TeacherClass from './Components/TeacherClass';
import TeacherRegistrationPage from './Components/TeacherRegistrationPage ';
import TeacherSignInPage from './Components/TeacherSignInPage';
import TeacherHomePage from './Components/TeacherHomePage';
import Class from './Components/Class.js';

function App() {

  return (
    <div  className="App">
      <Routes>
        <Route path="/" element={<SignInPage/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/register" element={<RegistrationPage/>} />
        <Route path="/educatorregister" element={<TeacherRegistrationPage/>} />
        <Route path="/educatorsignin" element={<TeacherSignInPage/>} />
        <Route path="/HomePage" element={<HomePage/>} /> {/*path="/HomePage/:id"*/}
        <Route path="/TeacherHomePage" element={<TeacherHomePage/>} />
        <Route path="/mylibrary" element={<MyLibrary/>} />
        <Route path="/teacherclass" element={<TeacherClass/>} />
        <Route path="/class" element={<Class/>}/>
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
        <Route path="/quizselection" element={<QuizSelect/>}/>
        <Route path="/typedquiz" element={<TypedQuiz/>}/>
        <Route path="/leaderboard" element={<Leaderboard/>}/>
      </Routes>
    </div>
  );
}

export default App;