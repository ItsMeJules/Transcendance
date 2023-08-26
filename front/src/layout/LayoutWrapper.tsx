import React, { ReactNode } from "react";
import { useLocation } from 'react-router-dom';
import BackgroundLinking from "layout/BackgroundLinking/BackgroundLinking";

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div style={{ position: "relative" }}>
      <BackgroundLinking key={location.state?.key} style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default LayoutWrapper;
