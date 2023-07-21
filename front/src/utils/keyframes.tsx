import { keyframes } from 'styled-components';

export const pulse = keyframes`
  0% {
    transform: translate(0%, 0%) scale(1);
  }
  50% {
    transform:  translate(0%, 0%) scale(1.2);
  }
  100% {
    transform:  translate(0%, 0%) scale(1);
  }
`;

export const glow1 = keyframes`
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  }
  50% {
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.1);
  }
  100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  }

`;

export const glow2 = keyframes`
  0% {
    text-shadow: 0 0 7px rgba(255, 255, 255, 0.7);
  }
  50% {
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  }
  100% {
    text-shadow: 0 0 7px rgba(255, 255, 255, 0.7);
  }

`;

export const text_glow = keyframes`
  0% {
    text-shadow: 0 0 7px rgba(255, 255, 255, 0.7);
  }
  50% {
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  }
  100% {
    text-shadow: 0 0 7px rgba(255, 255, 255, 0.7);
  }

`;