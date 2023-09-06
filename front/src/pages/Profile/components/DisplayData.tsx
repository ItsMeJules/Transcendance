import React from 'react';
import { MDBCardBody, MDBTypography, MDBCardText } from 'mdb-react-ui-kit';
import { UserData } from '../../../services/User/User';
import getProgressBarClass from 'utils/progressBar/ProgressBar';

interface DisplayDataProps {
  userData: UserData | null,
}

const DisplayData: React.FC<DisplayDataProps> = ({ userData }) => {
  const progressBarClass = getProgressBarClass(userData?.userLevel);

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
          <div className="stats-first-container">
            <div className="stats-first-sub-container">
              <MDBCardText className="mb-1 h5 text-center">
                {userData?.gamesPlayed}
              </MDBCardText>
              <MDBCardText className="small text-muted mb-0 custom-text-color text-center">
                Games played
              </MDBCardText>
            </div>
            <div className="stats-first-sub-container custom-text-color">
              <MDBCardText className="mb-1 h5 text-center">
                {userData?.userPoints}
              </MDBCardText>
              <MDBCardText className="small text-muted mb-0 custom-text-color text-center">
                Points won
              </MDBCardText>
            </div>
          </div>
        </MDBCardBody>

        <MDBCardBody className="data-values-main">
          <div className="data-values-sub">
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
          </div>
          <div className="stats-second-container">
            <div className="stats-second-sub-container">
              <MDBCardText className="mb-1 h5">
                {userData?.gamesWon}
              </MDBCardText>
              <MDBCardText className="small text-muted mb-0 custom-text-color">
                Games won
              </MDBCardText>
            </div>
            <div className="stats-second-sub-container">
              <div className={`progress-bar ${progressBarClass}`}></div>
              <MDBCardText className="small mt-0.5 text-muted mb-0 custom-text-color">
                Level {userData?.userLevel}
              </MDBCardText>
            </div>
          </div>
        </MDBCardBody>
      </div>
    </div>
  );
};

export default DisplayData;
