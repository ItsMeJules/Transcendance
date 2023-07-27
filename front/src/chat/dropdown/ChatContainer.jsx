import React from "react";

function ChatMessage({ messages }) {
  return (
    <div>{messages.map((message, index) => <div className="message" key={index}>{message}</div> )}</div>
  )
}

export default class ChatContainer extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		const style = {
			transition: "height 1s",
			height: this.props.chatToggled ? "300px" : "0px",
		}

		return (
			<div className="chat-container"
				style={style}
				onTransitionEnd={(e) => this.props.transitionEnd(e)}
			>
				
				<ChatMessage messages={this.props.messages}/>

			</div>
		)
	}

}