import React, { forwardRef } from 'react';

interface PopupProps {
  image: string;
  onClose: (event: React.MouseEvent<HTMLSpanElement>) => void;
  isLoading: boolean;
}

const Popup = forwardRef<HTMLDivElement, PopupProps>((props, ref) => {
  const { image, onClose, isLoading } = props;

  return (
    <div className="popup">
      <div className="popup-content" ref={ref}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        
        {isLoading ? (
          <p>Loading QR code...</p> 
        ) : (
          <>
            <img src={image} alt="QR code" />
            <p>Scan the QrCode, or Deactivate 2FA, if you don't, you'll lose access to your account.</p>
          </>
        )}
        
      </div>
    </div>
  );
});

export default Popup;