import { Link } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import './NoGame.scss'
import { useAppSelector } from "utils/redux/Store";

const NoGame: React.FC = () => {
  const { noGame } = useAppSelector(store => store.rightScreen)

  return (
    <>
      {noGame  &&
        <main className="no-game-outter-button">
          <Link to={APP_ROUTES.MATCHMAKING_ABSOLUTE}>
            <section className="no-game-link-button">
              <span>No game to play<br/><br/>Go to matchmaking</span>
            </section>
          </Link>
        </main>}
    </>
  );
}

export default NoGame;