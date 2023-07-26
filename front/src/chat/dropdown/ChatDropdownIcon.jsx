import React from "react";

import UpArrow from "../../assets/up-arrow.png"

function DropDownInput() {
	return (
		<input className="dropdown-input" placeholder="Ecrivez un message.." />
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

				{chatToggled && <DropDownInput />}

				<img className="dropdown-arrow-toggle" alt="Up-Arrow" src={UpArrow} style={arrowStyle} onClick={onClick} />
			</div>
		)
	}

}