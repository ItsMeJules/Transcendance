import React, { useEffect, useState, useRef } from 'react';

interface ToastErrorMessageProps {
  errMsg: string;
  resetErrMsg: () => void; // New prop to reset errMsg in the parent component
}

const ToastErrorMessage: React.FC<ToastErrorMessageProps> = ({ errMsg, resetErrMsg }) => {
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
          resetErrMsg(); // Call the function to reset errMsg in the parent component
        }, 3000);
      }
    };

    // Call the showToast function once the component is mounted
    showToast();

    // Clear the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [errMsg, isToastVisible, resetErrMsg]);

  return (
    <>
      {isToastVisible && errMsg && (
        <div id="toast" ref={toastRef}>
          <div id="img">
            <img src="/images/error.png" alt="Error" />
          </div>
          <div id="desc">{errMsg}</div>
        </div>
      )}
    </>
  );
};

export default ToastErrorMessage;
