import React, { useEffect, useRef, ReactNode } from "react";

type OutsideClickAlerterProps = {
  children: ReactNode
  className: string
  exclude?: React.RefObject<HTMLElement | null>
  onOutsideClick: () => void
  onInsideClick: () => void
};

function useClick(ref: React.RefObject<HTMLElement | null>, exclude: React.RefObject<HTMLElement | null> | undefined, onOutsideClick: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (exclude === undefined)
          onOutsideClick()
        else if ((event.target as Node) !== exclude.current)
          onOutsideClick()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [ref, onOutsideClick, exclude])
}

const OutsideClickHandler: React.FC<OutsideClickAlerterProps> = ({ children, className, exclude, onOutsideClick, onInsideClick }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  useClick(wrapperRef, exclude, onOutsideClick)

  return <div onClick={onInsideClick} className={className} ref={wrapperRef}>{children}</div>
};

export default OutsideClickHandler;