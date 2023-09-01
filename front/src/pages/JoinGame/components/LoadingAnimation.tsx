import React from "react";
import '../css/loading.css'

interface LoadingAnimationProps {
  inQueue: number;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ inQueue }) => {

  return (
    <main>
      {(inQueue === 1 || inQueue === 2) &&
        <section className="loading-container">
          <p className="loading"></p>
          <p id="loading-text" className="">
            Searching<br /> for opponent
          </p>
        </section>}
    </main>
  );
}
export default LoadingAnimation;