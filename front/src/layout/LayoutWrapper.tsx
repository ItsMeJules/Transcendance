import React, { ReactNode } from "react";
import { useLocation } from 'react-router-dom';
import BackgroundLinking from "layout/BackgroundLinking/BackgroundLinking";

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <BackgroundLinking />
        {children}
    </>
  );
};

export default LayoutWrapper;
