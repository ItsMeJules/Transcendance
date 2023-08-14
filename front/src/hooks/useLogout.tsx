import React, { useCallback } from "react";
import { APP_ROUTES, API_ROUTES} from "../Utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const handleLogout = async (setErrMsg: (error: string) => void) => {
  try {
    const response = await axios.post(API_ROUTES.LOG_OUT, null, {
      withCredentials: true,
    });
    if (response.status === 201) {
      window.location.href = APP_ROUTES.HOME;
    } else {
      console.error('Logout failed:', response.status);
      setErrMsg('Logout failed');
    }
  } catch (err: any) {
    if (!err?.response) {
      console.error('No Server Response');
      setErrMsg('No Server Response');
    } else if (err.response?.status === 400) {
      console.error('Bad request');
      setErrMsg('Bad request');
    } else if (err.response?.status === 401) {
      console.error('Unauthorized');
      window.location.href = APP_ROUTES.HOME;
    } else {
      console.error('Unknown error occurred');
      setErrMsg('Unknown error occurred');
    }
  }
};

export default handleLogout;