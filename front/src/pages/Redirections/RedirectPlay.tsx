import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { APP_ROUTES } from "utils/routing/routing";

const RedirectPlay = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(APP_ROUTES.PLAY_ABSOLUTE);
  }, []);

  return <div></div>;
};

export default RedirectPlay;
