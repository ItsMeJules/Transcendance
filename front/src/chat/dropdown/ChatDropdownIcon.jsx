import React, { useState } from "react";

import UpArrow from "../../assets/up-arrow.png"
import RightArrow from "../../assets/right-arrow.png"

function DropDownInput({chatToggled, sendData}) {
	const [value, setValue] = useState()

	if (!chatToggled)
		return <div className="dropdown-click-to-chat">Cliquez la flèche pour chatter</div>

	const handleEnterPressed = (e) => {
		if (e.key === "Enter") {
			sendData(value);
			setValue(""); // Clear the input after pressing Enter
		  }
	}

	return (
		<div className="dropdown-input">
			<input
				className="dropdown-input-button"
				onChange={(e) => setValue(e.target.value)}
				value={value}
				onKeyDown={(e) => handleEnterPressed(e)}
				placeholder="Ecrivez un message.." 
			/>

			<img
				className="dropdown-arrow-send"
				alt="Send"
				src={RightArrow}
				onClick={() => {
					sendData(value)
					setValue("")
				}}
			/>
		</div>
	)
}

export default class ChatDropdownIcon extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		const { chatToggled, onClick, chatOpeningFinished } = this.props

		const dropDownStyle = {
			borderTopRightRadius: (chatToggled ? "0px" : (chatOpeningFinished ? "0px" : "5px"))
		}

		const arrowStyle = {
			transition: "transform 1s ease",
			transform: (chatToggled ? "rotate(180deg)" : "")
		}

		return (
			<div className="dropdown-icon" style={dropDownStyle}>

				<DropDownInput chatToggled={chatToggled} sendData={this.props.sendData}/>

				<img
					className="dropdown-arrow-toggle"
					alt="Up-Arrow"
					src={UpArrow}
					style={arrowStyle}
					onClick={onClick}
				/>
			</div>
		)
	}

}