import React from "react";

export default function Messages({messages}) {
	return (
		<div>
			{messages.map((message, index) => <div key={index}>{message}</div>)}
		</div>
	)
}