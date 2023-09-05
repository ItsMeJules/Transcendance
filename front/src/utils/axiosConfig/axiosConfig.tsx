import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { APP_ROUTES } from "utils/routing/routing";
import { HttpStatus } from "utils/HttpStatus/HttpStatus";


export function useAxios() {
  const navigate = useNavigate();

  /* Declare instance */
  const customAxiosInstance = axios.create({
    baseURL: "",
    withCredentials: true,
  });

  /* Error handler functions */
  const handleSignupErrors = (err: any) => {
    if (err.response.status === HttpStatus.BAD_REQUEST) {
      switch (err.response.data.message) {
        case 'Username too long':
          console.log('YEAHHHHHH');
          toast.error('Username too long');
          break;
        case 'Password too long':
          toast.error('Password too long');  // Modified this to show a toast as well
          break;
        default:
          toast.error('Credentials taken');  // Modified this to show a toast
          break;
      }
    }
  }


  /* Main response handler */
  customAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response, config } = error;
      if (config.url.includes(APP_ROUTES.SIGN_UP)) {
        handleSignupErrors(error);




      }
      return Promise.reject(error);
    }
  );

  return customAxiosInstance;
}


        // if (error.response && error.response.status === 499) {
        //   console.log("You have to connect with 2FA");
        //   navigate("/profile/me/two-fa");
        // }
        // if (error.response && error.response.status === 450) {
        //   console.log("You don't have 2FA enabled");
        //   navigate("/profile/me");
        // }
        // if (error.response && error.response.status === 451) {
        //   console.log("You are already verified!! What are you trying to do???");
        //   navigate("/profile/me");
        // }