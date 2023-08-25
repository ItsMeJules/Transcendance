import React, { useEffect, useState, useRef } from 'react';
import { MdOutlineNotificationImportant } from 'react-icons/md';
import { IconContext } from 'react-icons';

interface ToastNotificationMessageProps {
  notifMsg: string;
  resetNotifMsg: () => void; // New prop to reset errMsg in the parent component
  changeRemoveFlag: () => void;
  resetIdToRemove: () => void;
}

const ToastNotificationMessage: React.FC<ToastNotificationMessageProps> = ({ notifMsg, resetNotifMsg, changeRemoveFlag, resetIdToRemove }) => {
  const [isToastVisible, setToastVisible] = useState(false);
  const toastRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Function to show the toast
    const showToast = () => {
      setToastVisible(true);
      const x = toastRef.current;
      if (x) {
        x.className = "show";
        timeoutId = setTimeout(() => {
          x.className = x.className.replace("show", "");
          setToastVisible(false);
          changeRemoveFlag();
          resetNotifMsg(); // Call the function to reset errMsg in the parent component
        }, 5950);
      }
    };

    // Call the showToast function once the component is mounted
    showToast();

    // Clear the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [notifMsg, isToastVisible, resetNotifMsg]);

  const handleToastClick = () => {
    // Handle the click on the toast message here
    // For example, you can reverse the operation or perform any other action
    // Then reset the notification message to hide the toast
    resetIdToRemove();
    resetNotifMsg();
  };

  return (
    <>
      {isToastVisible && notifMsg && (
        <div id="toast" ref={toastRef}>
          <div id="img">
            <IconContext.Provider
              value={{ color: 'black', size: '40px' }}>
              <MdOutlineNotificationImportant />
            </IconContext.Provider>
          </div>
          <button onClick={handleToastClick}
          style={{display: 'flex', alignItems: 'center'}}>
            <div id="desc">{notifMsg}</div>
          </button>
        </div>
      )}
    </>
  );
};

export default ToastNotification;
