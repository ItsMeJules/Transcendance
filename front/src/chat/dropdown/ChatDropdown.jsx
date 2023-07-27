import React from "react";
import { io } from 'socket.io-client';

import "./ChatDropdown.scss"

import ChatContainer from "./ChatContainer";
import ChatDropdownIcon from "./ChatDropdownIcon";

export default class ChatDropdown extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			chatToggled: false,
			chatOpeningFinished: false,
			socket: null,
			messages: [],
		}
	}

	componentDidMount() {
		const newSocket = io("http://localhost:3000");
		this.setState({ socket: newSocket });
	
		newSocket.on("message", this.onNewMessage);
	}

	componentWillUnmount() {
		const { socket } = this.state;

		if (socket) {
		  socket.off("message", this.onNewMessage);
		  socket.disconnect();
		}
	}

	sendData(data) {
		const { socket } = this.state;

		if (socket) {
			socket.emit("message", data);
		}
	}

	onNewMessage = (message) => {
		this.setState((prevState) => ({messages: [...prevState.messages, message]}));
	}

	toggleChat() {
		this.setState((prevState) => ({chatToggled: !prevState.chatToggled}))
	}

	transitionEnd(e) {
		if (e.target !== e.currentTarget)
			return
			
		this.setState((prevState) => ({chatOpeningFinished: !prevState.chatOpeningFinished}))
	}

	render() {
		const {chatToggled, chatOpeningFinished, messages } = this.state

		return (
			<div className="chat">

				<ChatDropdownIcon
					onClick={this.toggleChat.bind(this)}
					chatToggled={chatToggled}
					chatOpeningFinished={chatOpeningFinished}
					name="Chat"
					sendData={this.sendData.bind(this)}
				/>
				
				<ChatContainer
					chatToggled={chatToggled}
					transitionEnd={this.transitionEnd.bind(this)}
					messages={messages}
				/>

			</div>
		)
	}

}