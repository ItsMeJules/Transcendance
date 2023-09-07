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
            style={{ display: 'flex', position: 'absolute', zIndex: '10', width: '20%', height: '50%' }}></canvas>
        )
      }
    </div>
  );
}



export default ConfettisComponent;
