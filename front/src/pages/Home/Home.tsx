import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundMoving from 'layout/BackgroundMoving/BackgroundMoving';
import TextSection from './TextSection';
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { API_ROUTES, APP_ROUTES } from 'utils/routing/routing';

const Home = () => {
  const customAxiosInstance = useAxios();
  const history = useNavigate();

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateDimension);
    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, []); 

  const  handleButtonClick = async () => {
    // try {
    //   const response = await customAxiosInstance.get(API_ROUTES.HOME_CHECK_TOKEN,
    //     {
    //       withCredentials: true
    //     })
    //     if (response.data.tokenState === 'HAS_TOKEN')
    //       return history(APP_ROUTES.USER_PROFILE_ABSOLUTE);
        return history(APP_ROUTES.SIGN_IN, { state: { key: Date.now() } });
        
    // } catch (error) { };
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <BackgroundMoving />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <TextSection screenSize={screenSize} handleButtonClick={handleButtonClick} />
      </div>
    </div>
  );
};

export default Home;
