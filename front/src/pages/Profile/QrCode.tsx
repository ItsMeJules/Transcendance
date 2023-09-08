import React, { useState, useEffect } from "react";
import { API_ROUTES } from "../../utils/routing/routing";
import Popup from "./components/Popup";
import { useAxios } from "../../utils/axiosConfig/axiosConfig";

import "../Auth2factor/css/2faButton.scss";

const QrCode: React.FC = () => {
  const popupRef = React.createRef<HTMLDivElement>();
  const customAxiosInstance = useAxios();
  const [image, setImage] = useState<string>("");
  const [is2FAActive, setIs2FAActive] = useState<boolean | null>(null);
  const [isLoadingQRCode, setLoadingQRCode] = useState<boolean>(false);

  const codeGen = async () => {
    setLoadingQRCode(true);
    try {
      const response = await customAxiosInstance.post(
        API_ROUTES.ACTIVATE_2FA,
        {},
        {
          responseType: "arraybuffer",
          withCredentials: true,
        }
      );
      const blob = new Blob([response.data], { type: "image/png" });
      setImage(URL.createObjectURL(blob));
      setIs2FAActive(true);
      setLoadingQRCode(false);
    } catch (error) {
      setLoadingQRCode(false);
    }
  };

  const turnOff = async () => {
    try {
      await customAxiosInstance.post(
        API_ROUTES.DEACTIVATE_2FA,
        {},
        {
          withCredentials: true,
        }
      );
      setIs2FAActive(false);
    } catch (error) {}
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
    if (popupRef && popupRef.current && !popupRef.current.contains(event.target as Node)) {
      changeVisibleNone(event as any);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxiosInstance.get(API_ROUTES.STATE_2FA);
        setIs2FAActive(response.data);
      } catch (error) { }
    };

    fetchData();
  }, []); // customAxiosInstance for warning but learn how to add dependances?

  return (
    <div className="activate-and-deactivate">
      <button
        id="Activate/Deactivate"
        type="submit"
        className={`activate-deactivate-button ${is2FAActive ? "deactivate" : ""}`}
        onClick={(event) => {
          if (is2FAActive) {
            turnOff();
          } else {
            changeVisibleBlock(event);
            codeGen();
          }
        }}
      >
        {is2FAActive ? "Deactivate 2FA" : "Activate 2FA"}
      </button>

      <Popup
        ref={popupRef}
        isLoading={isLoadingQRCode}
        image={image}
        onClose={changeVisibleNone}
      />
    </div>
  );
};

export default QrCode;
