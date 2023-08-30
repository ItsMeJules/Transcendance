import React, { ReactNode, MouseEvent } from "react";

interface PopupProps {
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export default function Popup({ className, style, children }: PopupProps) {
  return (
    <div
      className={className}
      style={style}
      onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
