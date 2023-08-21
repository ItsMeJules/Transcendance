import React from 'react';
import { MDBTypography } from 'mdb-react-ui-kit';

interface LabelProps {
  className: string;
  tag: 'h5' | 'h6'; // You can add more tags if needed
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ className, tag, children }) => {
  return (
    <MDBTypography className={className} tag={tag}>
      {children}
    </MDBTypography>
  );
};

export default Label;