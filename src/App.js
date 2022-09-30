import './App.css';
import React, { useState } from "react";
import SignInPage from "./Components/signInPage.js";
import HomePage from "./Components/HomePage.js";
function App() {
  return (
    <div className='App'>
      <HomePage/>
      {/*<SignInPage /> */}
    </div>
  );
}

export default App;
