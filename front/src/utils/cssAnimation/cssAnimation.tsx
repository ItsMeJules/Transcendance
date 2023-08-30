import styled, { } from 'styled-components';
import { pulse, glow1, glow2, text_glow } from './keyframes';

export const GlowText = styled.h1`
  font-weight: light;
  font-family: dune, sans-serif;
  -webkit-text-fill-color: transparent;
  animation: ${glow2} 2s infinite;
`;

export const PulseGlowText = styled.button`
font-size: 7rem;
font-weight: light;
font-family: dune, sans-serif;
-webkit-text-fill-color: transparent;
animation: ${pulse} 2s infinite, ${glow1} 2s infinite;
`;

export const GlowTextSignin = styled.h1`
  font-weight: light;
  font-family: dune, sans-serif;
  -webkit-text-fill-color: transparent;
  animation: ${text_glow} 2s infinite;
`;