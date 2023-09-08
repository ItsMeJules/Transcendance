import React from 'react';
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { API_ROUTES } from 'utils/routing/routing';

interface ImageChangeProps {
  fetchUserProfile: () => void;
}

const ImageChange: React.FC<ImageChangeProps> = ({ fetchUserProfile }) => {
  const customAxiosInstance = useAxios();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("profilePicture", imageFile);
      try {
        
        const response = await customAxiosInstance.post(API_ROUTES.USER_PIC_CHANGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Add this line to include the withCredentials option
        });
        fetchUserProfile();
      } catch (err: any) { }
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
