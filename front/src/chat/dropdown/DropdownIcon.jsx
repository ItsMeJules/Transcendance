import React from "react";

import UpArrow from "../../assets/up-arrow.png"

export default class DropdownIcon extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="dropdown-icon">

				{this.props.chatToggled &&
						<input className="dropdown-input" placeholder="Ecrivez un message.." />
				}

				<img className="dropdown-arrow-toggle" src={UpArrow} onClick={this.props.onClick} />
			</div>
		)
	}

}