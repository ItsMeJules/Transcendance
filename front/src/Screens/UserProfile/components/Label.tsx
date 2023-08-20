import React from 'react';
import { MDBTypography } from 'mdb-react-ui-kit';

interface LabelProps {
  text: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ text, className, }) => {
  return (
    <MDBTypography className={className} tag='h5'>
      {text}
    </MDBTypography>
  );
};

export default Label;