import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Message from "./components/Message";

class App extends Component {
  fn_onDestroyComponent() {
    console.log("Hello!");
  }

  render() {
    return (
      <div className="App">
        <p>
          <Message username="user123" message="test message" onCrawlCompleted={this.fn_onDestroyComponent} />
        </p>
      </div>
    );
  }
}

export default App;
