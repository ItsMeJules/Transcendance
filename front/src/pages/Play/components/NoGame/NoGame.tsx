import { Link } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import './NoGame.scss'

interface NoGameProps {
  noGame: boolean;
}

const NoGame: React.FC<NoGameProps> = ({ noGame }) => {

  return (
    <>
      {noGame  &&
        <main className="no-game-outter-button">
          <Link to={APP_ROUTES.MATCHMAKING_ABSOLUTE}>
            <section className="no-game-link-button">
              <span>Go to matchmaking</span>
            </section>
          </Link>
        </main>}
    </>
  );
}

export default NoGame;