import React from 'react';
import { GlowTextSignin } from "utils/cssAnimation/cssAnimation";

const AuthenticationHeader: React.FC = () => {
  return (
    <GlowTextSignin
      className="font-dune items-center border border-white justify-center text-bold text-white"
      style={{ fontSize: "2rem", paddingTop: "50px", zIndex: "1" }}
    >
      2 Factor Authentication
    </GlowTextSignin>
  );
}

export default AuthenticationHeader;
