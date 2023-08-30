import React, { useEffect, useRef, ReactNode } from "react";

type OutsideClickAlerterProps = {
  children: ReactNode
  className: string
  onOutsideClick: () => void
  onInsideClick: () => void
};

function useClick(ref: React.RefObject<HTMLElement | null>, onOutsideClick: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        onOutsideClick()
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [ref, onOutsideClick])
}

const OutsideClickHandler: React.FC<OutsideClickAlerterProps> = ({ children, className, onOutsideClick, onInsideClick }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  useClick(wrapperRef, onOutsideClick)

  return <div onClick={onInsideClick} className={className} ref={wrapperRef}>{children}</div>
};

export default OutsideClickHandler;