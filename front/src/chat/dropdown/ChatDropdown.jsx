import React from "react";

import "./ChatDropdown.scss"

import ChatContainer from "./ChatContainer";
import ChatDropdownIcon from "./ChatDropdownIcon";

export default class ChatDropdown extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			chatToggled: false,
			chatOpeningFinished: false,
		}
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
		const {chatToggled, chatOpeningFinished } = this.state

		return (
			<div className="chat">

				<ChatDropdownIcon
					onClick={this.toggleChat.bind(this)}
					chatToggled={chatToggled}
					chatOpeningFinished={chatOpeningFinished}
					name="Chat"
				/>
				
				<ChatContainer
					chatToggled={chatToggled}
					transitionEnd={this.transitionEnd.bind(this)}
				/>

			</div>
		)
	}

}