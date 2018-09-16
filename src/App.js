import React, { Component } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import classNames from "classnames";
import io from "socket.io-client";

import globalEmotes from "./data/emotes.json";

import "./App.css";

const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

class App extends Component {
  /* State for this component has:
	* - channel: string
   	* - messages: Array<{
   	*    id: number
	*    height: number
	*  	 user: string
   	*    message: string
   	*	 color: string
	*   }>
   	*/
  constructor(props) {
    super(props);

    this.state = {
      channel: "",
      messages: [],
      areControlsInvisible: false
    };

    this.socket = io.connect("http://localhost:8080");
  }

  getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  getRandomHeight = () => {
    return Math.max(5, Math.min(95, Math.round(100 * Math.random())));
  };

  handleMessageState = response => {
    const { userstate, message } = response;
    // Keep messages inside viewport
    const height =
      this.getRandomHeight() >= WINDOW_HEIGHT
        ? WINDOW_HEIGHT
        : this.getRandomHeight();
    const newMessage = {
      id: userstate.id,
      user: userstate.username,
      color: userstate.color || this.getRandomColor(),
      height,
      message
    };
    let messages = [...this.state.messages, newMessage];
    // Limit messages array to 20 at a time
    if (messages.length >= 20) {
      messages = messages.slice(messages.length - 10);
    }
    this.setState({ messages });
  };

  handleWebsocket = () => {
    const { channel } = this.state;
    if (channel.trim() !== "") {
      this.toggleControlsVisibility();
      this.socket.emit("message", channel);
      this.socket.on("message", response => {
        this.handleMessageState(response);
      });
    }
  };

  toggleControlsVisibility = () => {
    this.setState({ areControlsInvisible: !this.state.areControlsInvisible });
  };

  handleChannelSearch = event => {
    event.preventDefault();
    this.handleWebsocket();
  };

  handleInputChange = ({ currentTarget: { name, value } }) => {
    this.setState({ [name]: value });
  };

  removeMessage = id => {
    const { messages } = this.state;
    this.setState(state => ({
      messages: messages.filter(message => message.id !== id)
    }));
  };

  parseMessage(msg) {
    let splitText = msg.split(" ");
    splitText.forEach((word, i) => {
      if (globalEmotes[word]) {
        const emote = (
          <img
            className="emote"
            src={`http://static-cdn.jtvnw.net/emoticons/v1/${
              globalEmotes[word].id
            }/3.0`}
            key={globalEmotes[word].id + i}
          />
        );

        // Replace the word with the HTML string
        splitText[i] = emote;
      } else {
        splitText[i] += " ";
      }
    });

    return splitText;
  }

  displayMessages = () =>
    this.state.messages.map(({ id, height, color, user, message }) => (
      <CSSTransition
        key={id}
        timeout={10000}
        classNames="fly"
        unmountOnExit
        onEntered={() => {
          this.removeMessage(id);
        }}
      >
        <div
          className="msg-container"
          style={{
            top: height + "%",
            color
          }}
        >
          <span className="msg-user">{user}</span>:{" "}
          <span className="msg-content">{this.parseMessage(message)}</span>
        </div>
      </CSSTransition>
    ));

  componentDidMount() {
    this.handleWebsocket();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    const { channel, messages } = this.state;
    return (
      <div className="app-container">
        <form
          onSubmit={this.handleChannelSearch}
          className={classNames("form-group", {
            controlsInvisible: this.state.areControlsInvisible
          })}
        >
          <input
            type="text"
            name="channel"
            value={channel}
            className="form-control"
            autoFocus={true}
            placeholder="Type a twitch channel to get chat comments..."
            onChange={this.handleInputChange}
          />
          <button className="btn btn-primary btn-sm btn-block" type="submit">
            Tune into stream
          </button>
        </form>
        <TransitionGroup className="app-group">
          {messages.length > 0 && (
            <iframe
              src={`https://player.twitch.tv/?channel=${channel}`}
              height={WINDOW_HEIGHT}
              width={WINDOW_WIDTH}
              frameBorder="0"
              scrolling="no"
              title={channel}
              allowFullScreen={true}
            />
          )}
          {messages.length > 0 && this.displayMessages()}
        </TransitionGroup>
      </div>
    );
  }
}

export default App;
