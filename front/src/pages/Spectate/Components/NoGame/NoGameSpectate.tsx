import { Link } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import './NoGameSpectate.scss'
import { useAppSelector } from "utils/redux/Store";

const NoGameSpectate: React.FC = () => {
  const { noGame } = useAppSelector(store => store.rightScreen)

  return (
    <>
      {noGame &&
        <main className="no-game-spectate-outter-button">
          <Link to={APP_ROUTES.MATCHMAKING_ABSOLUTE}>
            <section className="no-game-link-button">
              <span>Nothing to see here<br/><br/>Go to matchmaking</span>
            </section>
          </Link>
        </main>}
    </>
  );
}

export default NoGameSpectate;