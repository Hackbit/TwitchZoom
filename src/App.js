import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import io from 'socket.io-client';

// import uuid from "uuid/v1";

import './App.css';

class App extends Component {
	/* State for this component has:
   * - messages: Array<{
   *    id: number
   *    height: number
   *    user: string
   *    message: string
   		color: string
   *   }>
   */
	constructor(props) {
		super(props);

		this.state = {
			channel: '',
			messages: [],
		};

		this.socket = io.connect('http://localhost:8080');
	}

	getRandomColor = () => {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}

		return color;
	};

	handleMessegesState = response => {
		const { userstate, message } = response;
		const newMessage = {
			id: userstate.id,
			height: this.getRandomHeight(),
			user: userstate.username,
			color: userstate.color || this.getRandomColor(),
			message,
		};
		const messages = [...this.state.messages, newMessage];
		this.setState({ messages });
	};

	handleWebsocket = () => {
		const { channel } = this.state;
		if (channel.trim() !== '') {
			this.socket.emit('message', channel);
			this.socket.on('message', response => {
				this.handleMessegesState(response);
			});
		}
	};

	getRandomHeight = () => {
		return Math.max(5, Math.min(95, Math.round(100 * Math.random())));
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
			messages: messages.filter(message => message.id !== id),
		}));
	};

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
					className="form-group">
					<input
						type="text"
						name="channel"
						value={channel}
						className="form-control"
						placeholder="Type a twitch channel to get chat comments..."
						onChange={this.handleInputChange}
					/>
					<button className="btn btn-primary btn-sm" type="submit">
						Submit
					</button>
				</form>
				<h2>{channel}</h2>
				<TransitionGroup className="app-group">
					{messages.length > 0 &&
						messages.map(({ id, height, color, user, message }) => (
							<CSSTransition
								key={id}
								timeout={10000}
								classNames="fly"
								unmountOnExit
								onEntered={() => {
									this.removeMessage(id);
								}}>
								<div
									className="msg-container"
									style={{
										top: height + '%',
										color,
									}}>
									<span className="msg-user">{user}</span>:{' '}
									<span className="msg-content">
										{message}
									</span>
								</div>
							</CSSTransition>
						))}
				</TransitionGroup>
			</div>
		);
	}
}

export default App;
