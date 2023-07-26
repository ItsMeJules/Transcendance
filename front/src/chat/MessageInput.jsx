 import React, { useState } from "react";

export default function MessageInput({send}) {
	const [value, setValue] = useState()

	return (
		<div>
			<input
				onChange={(e) => setValue(e.target.value)}
				placeholder="Entrez un message"
				value={value}
			/>
			<button onClick={() => send(value)}>Envoyer</button>
		</div>
	)
}