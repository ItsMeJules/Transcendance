import React, { useState } from "react";

import TextSend from "./TextSend"

const TextInput = ({ sendData }) => {
  const [value, setValue] = useState("")

  const handleSend = () => {
    if (!value)
      return ;
    sendData(value);
    setValue("")
  }

  const handleEnterPressed = (e) => {
    if (e.key === "Enter")
      handleSend()
  }

  return (
    <div className="text-input">
      <input
        placeholder="Ecrivez un message..."
        onChange={(e) => setValue(e.target.value)}
        value={value}
        onKeyDown={(e) => handleEnterPressed(e)}
      />
      <TextSend
        hasText={!!value}
        handleSend={handleSend}
      />
    </div>
  )
}

export default TextInput;