import BackgroundLinking from "layout/BackgroundLinking/BackgroundLinking";
import React from "react";

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {

  return (
    <>
      <BackgroundLinking />
        {children}
    </>
  );
};

export default LayoutWrapper;
