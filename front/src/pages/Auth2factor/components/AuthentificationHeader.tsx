import React from 'react';
import { GlowTextSignin } from "utils/cssAnimation/cssAnimation";

const AuthenticationHeader: React.FC = () => {
  return (
    <GlowTextSignin
      className="font-dune items-center justify-center text-bold text-white text-center"
      style={{ fontSize: "2rem", paddingTop: "50px", zIndex: "1" }}
    >
      2 Factor Authentication
    </GlowTextSignin>
  );
}

export default AuthenticationHeader;
