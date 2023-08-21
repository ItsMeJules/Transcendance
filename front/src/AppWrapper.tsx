import React, { ReactNode } from "react";
import ParticlesBackgroundNew from "./Components/ParticlesSlow.memo";
import { useLocation} from 'react-router-dom';
import GlobalNavDropdown from "./Components/GlobalNavDropdown";

interface AppWrapperProps {
  children: ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div style={{ position: "relative" }}>
      <ParticlesBackgroundNew key={location.state?.key} style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <GlobalNavDropdown />
        {children}
      </div>
    </div>
  );
};

export default AppWrapper;