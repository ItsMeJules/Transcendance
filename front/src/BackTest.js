import axios from "axios";
import React from "react";

export class FormData extends React.Component {
	constructor(props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this)

		this.state = {firstName: '', lastName: ''};
	}
	
	async handleSubmit(event) {
		event.preventDefault();
		console.log("Submission!")
		
		try {
			const response = await axios.post("http://localhost:3000/user", {
				name: this.state.firstName
			})
			console.log(response)
		} catch (error) {
			console.error(error)
		}

		this.setState({ firstName: '', lastName: '' });
	};

	handleChange = (event) => {
		console.log("value set: " + event.target.value)
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		const { firstName, lastName } = this.state;

		return (
			<form onSubmit={this.handleSubmit}>
			<div>
				<label htmlFor="firstName">Prénom:</label>
				<input
				type="text"
				id="firstName"
				name="firstName"
				value={firstName}
				onChange={this.handleChange}
				/>
			</div>
			<div>
				<label htmlFor="lastName">Nom:</label>
				<input
				type="text"
				id="lastName"
				name="lastName"
				value={lastName}
				onChange={this.handleChange}
				/>
			</div>
			<button type="submit">Soumettre</button>
			</form>
		);
	}
}