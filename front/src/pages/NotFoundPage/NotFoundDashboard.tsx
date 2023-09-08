import { useEffect } from "react";
import "./css/NotFoundPageDashboard.scss";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { API_ROUTES } from "utils/routing/routing";

const NotFoundPageDashboard = () => {
  const customAxiosInstance = useAxios();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await customAxiosInstance.get(API_ROUTES.USER_PROFILE, {
          withCredentials: true,
        });
      } catch (err: any) {}
    };
    checkToken();
  }, []);

  return (
    <main className="not-found-dash-main-container">
      <section className="not-found-dash-sub-container">Nothing to see here</section>
    </main>
  );
};

export default NotFoundPageDashboard;
