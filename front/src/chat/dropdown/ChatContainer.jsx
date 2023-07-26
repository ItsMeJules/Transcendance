import React from "react";

function ChatMessage({ messages }) {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}

export default class ChatContainer extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			messages: []
		}
	}

	onNewMessage(message) {
		this.setState((prevState) => ({messages: [...prevState, message]}))
	}

	render() {
		const style = {
			transition: "height 1s",
			height: this.props.chatToggled ? "300px" : "0px",
		}

		return (
			<div className="chat-container" style={style}>
				<ChatMessage messages={this.state.messages}/>
			</div>
		)
	}

}