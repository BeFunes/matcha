import React, { Component } from 'react';
import './App.css';
import SignUpForm from "./containers/SignUpForm/SignUpForm";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          HEADER
        </header>
        <SignUpForm/>
      </div>
    );
  }
}

export default App;
