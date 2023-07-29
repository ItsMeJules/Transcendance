import React, { useCallback } from "react";
import { APP_ROUTES, API_ROUTES } from "../utils";
import axios from "axios";

const useLogout = () => {
  const logout = useCallback(async () => {
    try {
      const response = await axios.get(API_ROUTES.LOG_OUT, {
        withCredentials: true,
      });
      window.location.href = APP_ROUTES.HOME;
    } catch (err: any) {
      console.log("Error:", err.response.data.message);
    }
  }, []);

  return logout;
};

export default useLogout;