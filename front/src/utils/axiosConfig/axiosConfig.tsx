import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


export function useAxios() {
  const navigate = useNavigate();

  const customAxiosInstance = axios.create({
    baseURL: "",
    withCredentials: true,
  });

  customAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response, config } = error;
      if (config.url.includes('SIGN_UP')) {
        if (error.response && error.response.status === 499) {
          console.log("You have to connect with 2FA");
          navigate("/profile/me/two-fa");
        }
        if (error.response && error.response.status === 450) {
          console.log("You don't have 2FA enabled");
          navigate("/profile/me");
        }
        if (error.response && error.response.status === 451) {
          console.log("You are already verified!! What are you trying to do???");
          navigate("/profile/me");
        }
        return Promise.reject(error);
      }
    }
  );

  return customAxiosInstance;
}
