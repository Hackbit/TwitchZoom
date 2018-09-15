import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
// import uuid from "uuid/v1";

import './App.css';

class App extends Component {
  /* State for this component has:
   * - messages: Array<{
   *    id: number
   *    height: number
   *    user: string
   *    message: string
   *   }>
   */
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };

    this.fn_addMessage = this.fn_addMessage.bind(this);
    this.fn_removeMessage = this.fn_removeMessage.bind(this);

    this.eh_onClickButton = this.eh_onClickButton.bind(this);
  }

  get fn_getRandomHeight() { 
    return Math.max( 5, Math.min( 95, Math.round( (100 * Math.random()) ) ) ); 
  }

  fn_addMessage(user, message) {
    const { messages } = this.state;
    const length = messages.length;
    this.setState(state => ({
      messages: [
        ...messages,
        {
          id: length,
          height: this.fn_getRandomHeight,
          user: user || "testUserName",
          message: message || "Hellooooooooo"
        }
      ]
    }));
  }

  fn_removeMessage(id) {
    const { messages } = this.state;
    this.setState(state => ({
      messages: messages.filter(message => message.id !== id)
    }));
  }

  eh_onClickButton() {
    this.fn_addMessage();
  }

  componentDidMount() {
    setInterval(() => {
      this.eh_onClickButton();
    }, 3000);
  }

  render() {
    const { messages } = this.state;
    return (
      <div className="app-container">
        <button id="btn-test" onClick={this.eh_onClickButton}>Test</button>
        <TransitionGroup className="app-group"> 
          {messages.map( ({id, height, user, message}) => (
            <CSSTransition
              key={id}
              timeout={10000}
              classNames="fly"
              unmountOnExit
              onEntered={() => {
                this.fn_removeMessage(id);
              }}
            >
              <div 
                className="msg-container" 
                style={{ 
                  top: height + "%"
                }}
              >
                <span className="msg-user">{user}</span>: <span className="msg-content">{message}</span>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }  
}

export default App;
