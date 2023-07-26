import React from "react";

import "./ChatDropdown.scss"

import ChatContainer from "./ChatContainer";
import DropdownIcon from "./DropdownIcon";

export default class ChatDropdown extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			chatToggled: false
		}
	}

	toggleChat() {
		this.setState((prevState) => ({chatToggled: !prevState.chatToggled}))
	}

	render() {
		const chatToggled = this.state.chatToggled;

		return (
			<div className="chat">

				<DropdownIcon
					onClick={this.toggleChat.bind(this)}
					chatToggled={chatToggled}
					name="Chat"	
				/>
				<ChatContainer chatToggled={chatToggled}/>

			</div>
		)
	}

}