import React, { useState } from "react";

export default function Popup( {className, children, mousePos} ) {

  const style = {left: mousePos.x + "px", top: mousePos.y + "px"}
  
	return (
		<div className={className + "-container"} style={style}>
			<div className={className}>
        {children}
      </div>
		</div>
	)
}