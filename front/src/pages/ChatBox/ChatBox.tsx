import { createContext, useEffect, useRef, useState } from "react";

import "./ChatBox.scss";
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
import ChatContainer from "./chat_container/ChatContainer";
import ChatBar from "./chatbar/ChatBar";
import ChatMetadata from "./metadata/ChatMetadata";
import PayloadAction from "./models/PayloadSocket";
import {
  ChatSocketActionType,
  ChatSocketEventType,
  RoomSocketActionType,
} from "./models/TypesActionsEvents";
import { ChannelMessageData } from "./models/Channel";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";

export const SendDataContext = createContext<
  null | ((action: string, data: PayloadAction) => void)
>(null);

interface SocketAcknowledgements {
  actionType: string;
  userId: number;
  message: string;
  type: string;
}

interface PendingAcceptation {
  resolve: () => void;
  reject: () => void;
}

interface PayloadAnswerInvitation {
  message: string;
  gameData: any;
  player1: any;
  player2: any;
  gameChannel: any;
}

export const ChatBox = () => {
  const [socketData, setSocketData] = useState("");
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const pendingAcceptation = useRef<PendingAcceptation | null>(null);
  const chatSocket = useWebsocketContext().chat;
  const dispatch = useAppDispatch();
  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);
  const navigate = useNavigate();

  useEffect(() => {
    if (socketData === "") return;
    const dataString = JSON.stringify(socketData);
    const dataJSON = JSON.parse(dataString);
    localStorage.setItem("gameData", JSON.stringify(dataJSON.game));
    localStorage.setItem("player1", JSON.stringify(dataJSON.player1));
    localStorage.setItem("player2", JSON.stringify(dataJSON.player2));
    localStorage.setItem("gameChannel", JSON.stringify(dataJSON.gameChannel));
    if (window.location.pathname === APP_ROUTES.PLAY_ABSOLUTE) {
      navigate(APP_ROUTES.REDIRECT_PLAY);
    } else {
      navigate(APP_ROUTES.PLAY_ABSOLUTE);
    }
  }, [socketData]);

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
        });
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
        });
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
        });
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
        });
        break;
      case "invitation":
        chatSocket?.on("answerInvitation", (payload2: any) => {
          if (payload2.message === "yes") {
            chatSocket?.off("answerInvitation"); // Remove the listener
            setSocketData(payload2);
          } else {
            chatSocket?.off("answerInvitation"); // Remove the listener
          }
        });
        const handleAccept = () => {
          const payloadInvite: PayloadAction = {
            action: "acceptInvitation",
            targetId: payload.userId,
          };
          chatSocket?.emit(ChatSocketEventType.CHAT_ACTION, payloadInvite);
          toast.dismiss();
        };

        const handleDecline = () => {
          const payloadInvite: PayloadAction = {
            action: "refuseInvitation",
            targetId: payload.userId,
          };
          chatSocket?.emit(ChatSocketEventType.CHAT_ACTION, payloadInvite);
          toast.dismiss();
        };

        const InviteActions = () => (
          <div>
            {payload.message}
            <div className="btn-container">
              <button className="btn accept" onClick={handleAccept}>
                ✓
              </button>
              <button className="btn decline" onClick={handleDecline}>
                ✗
              </button>
            </div>
          </div>
        );

        toast(<InviteActions />, {
          position: "bottom-center",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        break;
      case "pending_invite":
        const conditionAcceptation = () => {
          return new Promise<void>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              chatSocket?.off("answerInvitation");
              reject();
            }, 15000);

            const listener = (payload2: any) => {
              if (payload2.message === "yes") {
                clearTimeout(timeoutId);
                chatSocket?.off("answerInvitation");
                resolve();
                setSocketData(payload2);
              } else {
                clearTimeout(timeoutId);
                chatSocket?.off("answerInvitation");
                reject();
              }
            };

            chatSocket?.on("answerInvitation", listener);
          });
        };
        toast.promise(conditionAcceptation(), {
          pending: "Waiting for " + payload.message + " to accept the invitation...",
          success: payload.message + " accepted the invitation",
          error: payload.message + " declined the invitation.",
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    chatSocket?.emit(ChatSocketEventType.CHAT_ACTION, {
      action: "joinRoom",
      roomName: activeChannelName,
    });
  }, []);

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
          dispatch(activeChannelAddUser(payload.userId));
          dispatch(activeChannelRemoveUserBanned(payload.userId));
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
      chatSocket?.off("answerInvitation");
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

    chatSocket?.emit(eventType, data);
  };

  return (
    <>
      <div className="chat-container">
        <SendDataContext.Provider value={sendData}>
          <ChatMetadata chatToggled={chatToggled} />
          <ChatContainer />

          <ChatBar chatToggled={chatToggled} />
        </SendDataContext.Provider>
      </div>
      {/* <div className="errors">lol</div>
      <div className="acknowledgements">lol</div> */}
    </>
  );
};

export default ChatBox;
