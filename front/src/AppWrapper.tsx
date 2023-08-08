import React, { ReactNode} from "react";
import ParticlesBackgroundNew from "./Components/ParticlesSlow.memo";

interface AppWrapperProps {
    children: ReactNode;
  }
  
const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <div
    style={{ position: "relative", overflow: "hidden" }}>
      <ParticlesBackgroundNew />
      {children}
    </div>
  );
};

export default AppWrapper;