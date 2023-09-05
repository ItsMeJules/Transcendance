import React from 'react';
import { MDBCardBody, MDBTypography, } from 'mdb-react-ui-kit';
import { UserData } from '../../../services/User/User';

interface DisplayDataProps {
  userData: UserData | null,
}

const DisplayData: React.FC<DisplayDataProps> = ({ userData }) => {
  return (
    <div>
      <div className="information-display-main">
        <MDBCardBody className="data-fields-name-main">
          <MDBTypography className="data-fields-name-sub-first" tag="h5">
            Email
          </MDBTypography>
          <MDBTypography className="data-fields-name-sub-others" tag="h5">
            Username
          </MDBTypography>
          <MDBTypography className="data-fields-name-sub-others" tag="h5">
            First name
          </MDBTypography>
          <MDBTypography className="data-fields-name-sub-others" tag="h5">
            Last name
          </MDBTypography>
        </MDBCardBody>
        <MDBCardBody className="data-values-main">
          <MDBTypography tag="h5" className="data-values-sub-first" title={userData?.email || ' '}>
            {userData?.email || '\u00A0'} {/* '\u00A0' is a non-breaking space */}
          </MDBTypography>
          <MDBTypography tag="h5" className="data-values-sub-others" title={userData?.username || ' '}>
            {userData?.username || '\u00A0'}
          </MDBTypography>
          <MDBTypography tag="h5" className="data-values-sub-others" title={userData?.firstName || ' '}>
            {userData?.firstName || '\u00A0'}
          </MDBTypography>
          <MDBTypography tag="h5" className="data-values-sub-others" title={userData?.lastName || ' '}>
            {userData?.lastName || '\u00A0'}
          </MDBTypography>
        </MDBCardBody>
      </div>
    </div>
  );
};

export default DisplayData;
