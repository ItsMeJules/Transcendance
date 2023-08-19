import React, { forwardRef } from 'react';

interface PopupProps {
  image: string;
  onClose: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

const Popup = forwardRef<HTMLDivElement, PopupProps>((props, ref) => {
  const { image, onClose } = props;

  return (
    <div className="popup">
      <div className="popup-content" ref={ref}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={image} alt="QR code" />
        <p>Contenu de la fenêtre popup...</p>
      </div>
    </div>
  );
});

export default Popup;