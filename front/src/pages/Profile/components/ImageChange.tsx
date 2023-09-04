import React from 'react';
import axios from 'axios';
import { API_ROUTES } from 'utils/routing/routing';

interface ImageChangeProps {
  fetchUserProfile: () => void;
}

const ImageChange: React.FC<ImageChangeProps> = ({ fetchUserProfile }) => {

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("IMAGE:", API_ROUTES.USER_PIC_CHANGE);
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("profilePicture", imageFile);
      try {
        
        const response = await axios.post(API_ROUTES.USER_PIC_CHANGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Add this line to include the withCredentials option
        });
        console.log('err:',response);
        fetchUserProfile();
      } catch (err: any) {
        // catch unauthorized too!!!
        console.log('err:',err);
        // if (!err?.response) {
        //   setErrMsg('No Server Response');
        // } else if (err.response?.status === 403) {
        //   setErrMsg(`${err.response.data.message}`);
        // } else if (err.response?.status === 413) {
        //   const errorResponse = err.response.data;
        //   setErrMsg(errorResponse.error); // Set the error message to the errMsg variable
        // }
        // else
        //   setErrMsg(err.response.data.message);

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
