import React, { ReactNode} from "react";
import ParticlesBackgroundNew from "./Components/ParticlesSlow.memo";

interface AppWrapperProps {
    children: ReactNode;
  }
  
const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <div
    style={{ position: "relative", overflow: "hidden"}}>
      <div style={{ zIndex: 1, position: 'relative'}}><ParticlesBackgroundNew/></div>
      <div style={{ zIndex: 2, position: 'relative' }}>{children}</div>
    </div>
  );
};

export default AppWrapper;