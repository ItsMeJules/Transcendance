import { useState, KeyboardEvent, useContext } from "react";

import TextSend from "./TextSend";
import { ChatSocketActionType, SendDataContext } from "../ChatBox";

const TextInput = () => {
  const [value, setValue] = useState<string>("");

  const sendData: null | ((action: ChatSocketActionType, data: any) => void) = useContext(SendDataContext)

  const handleSend = () => {
    if (sendData == null)
      return
      
    if (!value.trim())
      return;

    sendData(ChatSocketActionType.SEND_MESSAGE, value)
    setValue("");
  };

  const handleEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="text-input">
      <input
        autoFocus
        placeholder="Ecrivez un message..."
        onChange={(e) => setValue(e.target.value)}
        value={value}
        onKeyDown={(e) => handleEnterPressed(e)}
      />
      <TextSend hasText={!!value.trim()} handleSend={handleSend} />
    </div>
  );
};

export default TextInput;
