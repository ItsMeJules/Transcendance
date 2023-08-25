import React from "react";
import handleLogout from "./useLogout";
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { IconContext } from 'react-icons';

interface LogoutParentProps {
  setErrMsg: (error: string) => void; // Callback function to set errMsg in UserProfile component
}

const LogoutParent: React.FC<LogoutParentProps> = ({ setErrMsg }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const error = searchParams.get("error");

  const onLogout = async () => {
    try {
      await handleLogout(setErrMsg);
    } catch (error: any) {
    }
  };

  return (
    <div>
      <button title="Log out" onClick={onLogout}>
        <IconContext.Provider value={{ color: 'black', size: '30px' }}>
          <FaArrowRightFromBracket />
        </IconContext.Provider>
        {error && <div>Error: {error}</div>}
      </button>
    </div>
  );
};

export default LogoutParent;
