import { useState, KeyboardEvent, useContext } from "react";
import PayloadAction from "../models/PayloadSocket";
import TextSend from "./TextSend";
import { ChatSocketEventType } from "../models/TypesActionsEvents";
import { useAppSelector } from "../../../redux/Store";
import { SendDataContext } from "../ChatBox";

const TextInput = () => {
  const [value, setValue] = useState<string>("");

  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const handleSend = () => {
    if (sendData == null) return;

    if (!value.trim()) return;

    sendData(ChatSocketEventType.MESSAGE, {
      message: value,
      roomName: activeChannelName,
    } as PayloadAction);
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
