import React from "react";
import handleLogout from "./useLogout";
import { MDBCardImage } from "mdb-react-ui-kit";
import { unsetUser } from "../redux/reducers/UserSlice";
import { useAppDispatch } from "../redux/Store";

interface LogoutParentProps {
  setErrMsg: (error: string) => void; // Callback function to set errMsg in UserProfile component
}

const LogoutParent: React.FC<LogoutParentProps> = ({ setErrMsg }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const error = searchParams.get("error");
  const dispatch = useAppDispatch()

  const onLogout = async () => {
    try {
      await handleLogout(setErrMsg);
      dispatch(unsetUser())
      
    } catch (error: any) {
    }
  };

  return (
    <div>
      <button title="Log out" onClick={onLogout}>
        <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
        {error && <div>Error: {error}</div>}
      </button>
    </div>
  );
};

export default LogoutParent;
