import React from 'react';

interface TwoFaContainerProps {
  children?: React.ReactNode;
}

const TwoFaContainer: React.FC<TwoFaContainerProps> = ({ children }) => {
  return (
    <div 
      className="login-container flex justify-center border border-white"
      style={{ zIndex: "1" }}
    >
      {children}
    </div>
  );
}

export default TwoFaContainer;