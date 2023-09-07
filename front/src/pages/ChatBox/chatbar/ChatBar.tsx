import React from "react";

import TextInput from "./TextInput";

const ChatBar: React.FC = () => {

  return (
    <div className="chatbar-container">
      <div className="text"><TextInput /></div>
    </div>
  );
};

export default ChatBar;
