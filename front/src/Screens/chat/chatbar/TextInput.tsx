import React, { useState, KeyboardEvent, useEffect } from "react";

import TextSend from "./TextSend";

interface TextInputProps {
  sendData: (value: string) => void;
}

const TextInput: React.FunctionComponent<TextInputProps> = ({ sendData }) => {
  const [value, setValue] = useState<string>("");

  const handleSend = () => {
    if (!value.trim()) return;
    sendData(value);
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
