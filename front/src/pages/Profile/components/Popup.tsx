import React, { forwardRef } from 'react';
import { MDBCardText } from 'mdb-react-ui-kit';

interface PopupProps {
  image: string;
  onClose: (event: React.MouseEvent<HTMLSpanElement>) => void;
  isLoading: boolean;
}

const Popup = forwardRef<HTMLDivElement, PopupProps>(
  ({ image, onClose, isLoading }, ref) => {
    const renderContent = () => {
      if (isLoading) {
        return <MDBCardText>Loading QR code...</MDBCardText>;
      }

      return (
        <>
          <img src={image} alt="QR code" style={{borderRadius:"12px"}}/>
          <MDBCardText>
            Scan the QrCode, or Deactivate 2FA, if you don't, you'll lose
            access to your account.
          </MDBCardText>
        </>
      );
    };

    return (
      <div className="popup">
        <div className="popup-content" ref={ref}>
          <span className="close" onClick={onClose}>
            &times;
          </span>
          {renderContent()}
        </div>
      </div>
    );
  }
);

export default Popup;