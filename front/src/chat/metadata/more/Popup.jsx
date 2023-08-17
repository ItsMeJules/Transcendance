import React from "react";

export default function Popup({ className, children }) {
	return (
		<div className={className} onClick={(e) => e.stopPropagation()}>
			{children}
		</div>
	)
}