import React from 'react';

interface ErrorMessageProps {
  errMsg: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errMsg }) => {
  return (
    <p
      className={errMsg ? "errmsg text-white" : "offscreen"}
      aria-live="assertive"
    >
      {errMsg}
    </p>
  );
}

export default ErrorMessage;
