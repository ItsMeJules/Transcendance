import React, { useState } from "react";

export default function Popup( {className, children} ) {
	return (
		<div className={className + "-container"}>
			<div className={className}>
        {children}
      </div>
		</div>
	)
}