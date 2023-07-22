import React, { useCallback } from "react";
import { APP_ROUTES } from "../utils";

const useLogout = () => {

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        console.log(APP_ROUTES.HOME);
        window.location.href = APP_ROUTES.HOME; // Manually navigate to the home page
      }, []);

    return logout;
};

export default useLogout;