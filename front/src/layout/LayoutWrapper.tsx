import React from "react";
import BackgroundLinking from "layout/BackgroundLinking/BackgroundLinking";

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
