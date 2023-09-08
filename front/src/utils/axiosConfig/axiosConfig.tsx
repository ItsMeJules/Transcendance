import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import { HttpStatus } from "utils/HttpStatus/HttpStatus";

enum ERROR {
  NO = 0,
  YES = 1,
}

export function useAxios() {
  const navigate = useNavigate();

  /* Declare instance */
  const customAxiosInstance = axios.create({
    baseURL: "",
    withCredentials: true,
  });

  /* Message error cleaner */
  function extractErrorMessage(err: any) {
    if (!err.response || !err.response.data || !err.response.data.message) return undefined;

    const { message } = err.response.data;
    if (Array.isArray(message)) return message[0];
    return message;
  }

  /* Global handler function */
  /* Global Error handler function */
  const handleGlobalErrors = (err: any, toastId: string) => {
    const errorMessage = extractErrorMessage(err); // Get specific error message if available

    if (!err.response) {
      toast.error("Network error", { toastId });
      return;
    }

    switch (err.response.status) {
      case 400: // Bad Request
        toast.error(errorMessage || "Bad request", { toastId });
        break;

      case 401: // Unauthorized
        // toast.error(errorMessage || "Unauthorized. Please log in again.", { toastId });
        navigate("/login?error=unauthorized");
        break;

      case 403: // Forbidden
        toast.error(errorMessage || "You don't have permission to do this", { toastId });
        break;

      case 404: // Not Found
        toast.error(errorMessage || "Resource not found", { toastId });
        break;

      case 408: // Request Timeout
        toast.error(errorMessage || "Request timeout. Please try again", { toastId });
        break;

      case 500: // Internal Server Error
        toast.error(
          errorMessage || "Something went wrong on our end. Please try again later.",
          { toastId }
        );
        break;

      case 503: // Service Unavailable
        toast.error(errorMessage || "Service unavailable. Please try again later.", {
          toastId,
        });
        break;

      default:
        toast.error(errorMessage || "An error occurred. Please try again later.", { toastId });
    }
  };

  /* Components handler functions */
  const handleLoginErrors = (err: any, toastId: string) => {
    if (err.response.status === HttpStatus.BAD_REQUEST && err.response.data.message) {
      toast.error(extractErrorMessage(err), { toastId });
      return ERROR.YES;
    }
    return ERROR.NO;
  };

  const handle2FAErrors = (err: any, toastId: string) => {
    if (err.response && err.response.status === 450) {
      navigate("/dashboard/profile/me?error=no2fa");
      return ERROR.YES;
    } else if (err.response && err.response.status === 451) {
      navigate("/dashboard/profile/me?error=alreadyverified");
      return ERROR.YES;
    } else if (err.response && err.response.status === 499) {
      navigate("/profile/me/two-fa?error=unauthorized");
      return ERROR.YES;
    }

    return ERROR.NO;
  };

  function needsTokenRefresh() {
    const expireDateCookie = document.cookie
      .split(";")
      .find((row) => row.trim().startsWith("expire_date_access_token="));

    if (!expireDateCookie) return false;

    const tokenExpirationValue = expireDateCookie.split("=")[1];

    const tokenExpiration = new Date(Number(tokenExpirationValue) * 1000);
    const currentTime = new Date();
    return Number(currentTime) + 50000 >= Number(tokenExpiration);
  }

  customAxiosInstance.interceptors.request.use(
    async (config) => {
      if (needsTokenRefresh()) {
        try {
          await axios.post(
            API_ROUTES.REFRESH_TOKEN,
            { withCredentials: true },
            {
              withCredentials: true,
            }
          );
        } catch (error) {
          navigate("/login?error=token_refresh_failed");
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /* Main response handler */
  customAxiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const { response, config } = error;
      let errorValue: number = ERROR.NO;
      const toastId = "error";

      if (toast.isActive(toastId)) return;

      if (config.url.includes(APP_ROUTES.SIGN_UP))
        // Sign up ok
        errorValue = handleLoginErrors(error, toastId);
      if (config.url.includes(APP_ROUTES.SIGN_IN))
        // Sign in ok
        errorValue = handleLoginErrors(error, toastId);
      errorValue = handle2FAErrors(error, toastId);
      if (!errorValue) handleGlobalErrors(error, toastId);

      return Promise.reject(error);
    }
  );
  return customAxiosInstance;
}
