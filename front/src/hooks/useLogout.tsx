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

    // After logout logic
    // document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // console.log(APP_ROUTES.HOME);
     // Manually navigate to the home page
  }, []);

  return logout; // Return the logout function
};

export default useLogout;