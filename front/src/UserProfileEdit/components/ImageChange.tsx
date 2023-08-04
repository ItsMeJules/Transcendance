import React from 'react';
import { UserData } from '../../services/user';
import axios from 'axios';
import { API_ROUTES } from '../../utils';

interface ImageChangeProps {
  setErrMsg: (error: string) => void; // Callback function to set errMsg in UserProfile component
  fetchUserProfile: () => void;
}

const ImageChange: React.FC<ImageChangeProps> = ({ setErrMsg, fetchUserProfile }) => {

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("IMAGE:", API_ROUTES.USER_PIC_CHANGE);
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("profilePicture", imageFile);
      try {
        
        await axios.post(API_ROUTES.USER_PIC_CHANGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Add this line to include the withCredentials option
        });
        fetchUserProfile();
      } catch (err: any) {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 403) {
          setErrMsg(`${err.response.data.message}`);
        } else
          setErrMsg(err.response.data.message);

      }
    }
  };

  return (
    <div className="profile-pic-upload-button">
      <label className="custom-file-input">
        <input type="file" accept=".png, .jpg, .jpeg" onChange={handleImageChange} />
        Upload Profile Picture
      </label>
    </div>
  )
}

export default ImageChange;