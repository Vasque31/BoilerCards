import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import SignInPage from "./Components/signInPage.js";
import HomePage from "./Components/HomePage.js";
import Header from './Components/Header';


function App() {
  return (
    <div className='App'>
      {/*<Header/>*/}

      <HomePage/>
      {/*<SignInPage/> */}
    </div>
  );
}

export default App;
