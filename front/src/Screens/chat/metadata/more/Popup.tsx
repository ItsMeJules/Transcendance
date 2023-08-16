import React, { ReactNode, MouseEvent } from "react";

interface PopupProps {
  className?: string;
  children: ReactNode;
}

export default function Popup({ className, children }: PopupProps) {
  return (
    <div
      className={className}
      onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
