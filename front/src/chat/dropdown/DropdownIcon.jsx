import React from "react";

export default class DropdownIcon extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="dropdown-icon" onClick={this.props.onClick}>
				<input placeholder="Ecrivez du texte.."></input>
				<div className="dropdown-icon-text">{this.props.name}</div>
			</div>
		)
	}

}