import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../../Utils/constants";
import { MDBContainer, MDBCard, MDBCardImage } from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import ToastErrorMessage from "../../Components/ToastErrorMessage";
import getProgressBarClass from "../../Components/ProgressBarClass";
import DisplayData from "./components/DisplayData";
import DisplayStats from "./components/DisplayStats";
import ProfilePicContainer from "./components/ProfilePicContainer";
import LogoutParent from "../../LogoutHook/logoutParent";
import { Socket } from "socket.io-client";
import {
  connectSocket,
  disconnectSocket,
  deregisterSocket,
} from "../../Websocket/Socket.io";
import User from "../../Services/User";
import { UserData } from "../../Services/User";
import QRCode from "react-qr-code";
import { useAxios } from "../../api/axios-config";

function QrCode(): React.ReactElement {
  const popupRef = React.createRef<HTMLDivElement>();
  const axiosInstanceError = useAxios();
  const [code, setCode] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const codeGen = async () => {
    try {
      const response = await axiosInstanceError.post(
        API_ROUTES.ACTIVATE_2FA,
        {},
        {
          responseType: "arraybuffer",
          withCredentials: true,
        }
      );
      const blob = new Blob([response.data], { type: "image/png" });
      setImage(URL.createObjectURL(blob));
      console.log(response);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const turnOff = async () => {
    const response = await axiosInstanceError.post(
      API_ROUTES.DEACTIVATE_2FA,
      {},
      {
        withCredentials: true,
      }
    );
  };

  const changeVisibleBlock = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    document.documentElement.style.setProperty("--visible", "block");
  };

  const changeVisibleNone = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    document.documentElement.style.setProperty("--visible", "none");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popupRef &&
      popupRef.current &&
      !popupRef.current.contains(event.target as Node)
    ) {
      changeVisibleNone(event as any);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button
        id="myBtn"
        className="myBtn"
        onClick={(event) => {
          changeVisibleBlock(event);
          codeGen();
        }}
      >
        Activate 2FA
      </button>
      <button
        id="myBtn"
        className="myBtn"
        onClick={() => {
          turnOff();
        }}
      >
        DeActivate 2FA
      </button>
      <div id="mypopup" className="popup">
        <div className="popup-content" ref={popupRef}>
          <span className="close" onClick={changeVisibleNone}>
            &times;
          </span>
          {/* <QRCode style={{ justifyContent: "center" }} value={code} /> */}
          <img src={image} alt="QR code" />
          {/* <p>{code}</p> */}
          <p>Contenu de la fenêtre popup...</p>
        </div>
      </div>
    </div>
  );
}

export const UserProfile: React.FC = () => {
  const [userDataHere, setUserDataHere] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [level, setLevel] = useState(0);
  const progressBarClass = getProgressBarClass(level);
  const history = useNavigate();
  const [socket, setSocket] = useState<Socket | null | undefined>(null);
  const axiosInstanceError = useAxios();

  const resetErrMsg = () => {
    setErrMsg(""); // Reset errMsg to an empty string
  };

  const fetchUserProfile = async () => {
    try {
      // const storedUserData = localStorage.getItem("userData");
      // if (storedUserData) {
      //   const parsedUserData = JSON.parse(storedUserData);
      //   console.log("dispatching 1 and parsed ud", parsedUserData);
      //   // dispatch(setUserData(parsedUserData));
      // }

      const response = await axiosInstanceError.get(API_ROUTES.USER_PROFILE, {
        withCredentials: true,
      });
      const userData = response.data;
      localStorage.setItem("userData", JSON.stringify(userData));
      setUserDataHere(userData);
      User.getInstance().setUserFromResponseData(userData);
      setLevel(User.getInstance().getUserLevel());
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Bad request");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
        history(APP_ROUTES.HOME);
      } else {
        setErrMsg("Error");
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogoutError = (error: string) => {
    setErrMsg(error);
    console.log("Error", error);
  };

  return (
    <div className="vh-100 d-flex" style={{ paddingTop: "75px" }}>
      <MDBContainer className="profile-board-container ">
        <MDBCard className="profile-board-card ">
          <div className="profile-board-header-show-profile">
            <Link
              title="Edit profile"
              to={APP_ROUTES.USER_PROFILE_EDIT}
              style={{ padding: "0px" }}
            >
              <MDBCardImage
                src="/images/edit_profile.png"
                fluid
                style={{ width: "30px" }}
              />
            </Link>

            <LogoutParent setErrMsg={setErrMsg} />
          </div>

          <ProfilePicContainer userData={userDataHere} />

          <div className="fade-line" style={{ marginTop: "20px" }}></div>

          <DisplayData userData={userDataHere} />

          <div className="fade-line" style={{ marginTop: "-10px" }}></div>

          <DisplayStats userData={userDataHere} />
          <QrCode></QrCode>
        </MDBCard>
      </MDBContainer>

      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div>
  );
};
