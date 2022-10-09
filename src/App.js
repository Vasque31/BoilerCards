import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import SignInPage from "./Components/signInPage.js";
import HomePage from "./Components/HomePage.js";
import Header from './Components/Header.js';
import Settings from "./Components/Settings.js";

function App() {
  return (
    <div className='App'>
      {/*<Header/>*/}
      {/*<Settings/>*/}
      <HomePage/>
      {/*<SignInPage/> */}
    </div>
  );
}

export default App;
