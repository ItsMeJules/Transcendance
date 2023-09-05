import { createContext, useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { useAppDispatch, useAppSelector } from "utils/redux/Store";
import {
  activeChannelAddAdmin,
  activeChannelAddUser,
  activeChannelAddUserBanned,
  activeChannelRemoveAdmin,
  activeChannelRemoveUser,
  activeChannelRemoveUserBanned,
  setActiveChannel,
  setActiveChannelMessages,
} from "utils/redux/reducers/ChannelSlice";
import {
  addUserBlocked,
  removeUserBlocked,
  setUserActiveChannel,
} from "utils/redux/reducers/UserSlice";
import "./ChatBox.scss";
import ChatContainer from "./chat_container/ChatContainer";
import ChatBar from "./chatbar/ChatBar";
import ChatMetadata from "./metadata/ChatMetadata";
import { ChannelMessageData } from "./models/Channel";
import PayloadAction from "./models/PayloadSocket";
import {
  ChatSocketActionType,
  ChatSocketEventType,
  RoomSocketActionType,
} from "./models/TypesActionsEvents";

export const SendDataContext = createContext<null | ((action: string, data: PayloadAction) => void)>(null);

interface SocketAcknowledgements {
  actionType: string;
  userId: number;
  message: string;
  type: string;
}

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const chatSocket = useWebsocketContext().chat;
  const dispatch = useAppDispatch();
  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);

  const displayAcknowledgements = (payload: SocketAcknowledgements) => {
    switch (payload.type) {
      case "info":
        toast(`${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      case "error":
        toast.error(`Error: ${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      case "success":
        toast.success(`${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      case "warning":
        toast.warning(`${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      case "invitation":
        toast.info(`${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      case "pending_invite":
        toast.info(`${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // create payloads not any, create functions not callback in parameter
    chatSocket?.on(ChatSocketEventType.JOIN_ROOM, (payload: any) => {
      dispatch(setUserActiveChannel(payload.name));
      dispatch(setActiveChannel(payload));
    });

    chatSocket?.on(ChatSocketEventType.ACKNOWLEDGEMENTS, (payload: SocketAcknowledgements) => {
      switch (payload.actionType) {
        case RoomSocketActionType.PROMOTE:
          dispatch(activeChannelAddAdmin(payload.userId));
          break;
        case RoomSocketActionType.DEMOTE:
          dispatch(activeChannelRemoveAdmin(payload.userId));
          break;
        case RoomSocketActionType.BAN:
          dispatch(activeChannelRemoveUser(payload.userId));
          dispatch(activeChannelAddUserBanned(payload.userId));
          break;
        case RoomSocketActionType.UNBAN:
          dispatch(activeChannelRemoveUserBanned(payload.userId));
          dispatch(activeChannelAddUser(payload.userId));
          break;
        case ChatSocketActionType.BLOCK:
          dispatch(addUserBlocked(payload.userId));
          break;
        case ChatSocketActionType.UNBLOCK:
          dispatch(removeUserBlocked(payload.userId));
          break;
        case RoomSocketActionType.INVITE:
          dispatch(activeChannelAddUser(payload.userId));
          break;
        default:
          break;
      }
      displayAcknowledgements(payload);
    });

    chatSocket?.on(ChatSocketEventType.FETCH_MESSAGES, (payload: ChannelMessageData[]) => {
      dispatch(setActiveChannelMessages(payload)); // faire fonction
    });

    return () => {
      chatSocket?.off(ChatSocketEventType.FETCH_MESSAGES);
      chatSocket?.off(ChatSocketEventType.JOIN_ROOM);
      chatSocket?.off(ChatSocketEventType.ACKNOWLEDGEMENTS);
      chatSocket?.off(ChatSocketEventType.SUCCESS);
      chatSocket?.off(ChatSocketEventType.ERRORS);
    };
  }, [dispatch, chatSocket, activeChannelName]);

  function isChatSocketActionType(action: string): action is ChatSocketActionType {
    return Object.values(ChatSocketActionType).includes(action as ChatSocketActionType);
  }

  function isRoomSocketActionType(action: string): action is RoomSocketActionType {
    return Object.values(RoomSocketActionType).includes(action as RoomSocketActionType);
  }

  const sendData = (action: string, data: PayloadAction) => {
    let eventType = ChatSocketEventType.MESSAGE;

    if (isChatSocketActionType(action)) {
      eventType = ChatSocketEventType.CHAT_ACTION;
    }
  
    if (isRoomSocketActionType(action)) {
      if (!activeChannelName) return;
      data = { ...data, roomName: activeChannelName };
      eventType = ChatSocketEventType.ROOM_ACTION;
    }

    // console.log("data is :", data, "on eventType :", eventType);
    console.log("sendData with action :", action, "and data :", data);
    chatSocket?.emit(eventType, data);
  };

  const togglerTransition = {
    height: chatToggled ? "50vh" : "0vh",
  };

  return (
    <>
      <ToastContainer />
      <div className="chat-container">
        <SendDataContext.Provider value={sendData}>
          <div className="toggler" style={togglerTransition}>
            <ChatMetadata chatToggled={chatToggled} />
            <ChatContainer />
          </div>

          <ChatBar chatToggled={chatToggled} setChatToggled={setChatToggled} />
        </SendDataContext.Provider>
      </div>
      {/* <div className="errors">lol</div>
      <div className="acknowledgements">lol</div> */}
    </>
  );
};

export default ChatBox;
