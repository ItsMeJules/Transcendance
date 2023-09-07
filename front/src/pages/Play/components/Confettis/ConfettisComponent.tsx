import React, { useEffect, useRef } from "react";
import confettisAnimation from "./confettis";

interface ConfettisComponentProps {
  gameIsEnded: boolean;
  userIsWinner: boolean;
}

const ConfettisComponent: React.FC<ConfettisComponentProps> = ({ gameIsEnded, userIsWinner }) => {
  const confettiCanvasRef = useRef(null);


  // Winner confettis animation
  useEffect(() => {
    if (confettiCanvasRef.current) {
      confettisAnimation(confettiCanvasRef.current);
    }
  }, [gameIsEnded]);

  return (
    <div>
      {
        userIsWinner && (
          <canvas ref={confettiCanvasRef}
            id="confettis"
            style={{ position: 'absolute', zIndex: '1', width: '100%', height: '100%' }}></canvas>
        )
      }
    </div>
  );
}



export default ConfettisComponent;