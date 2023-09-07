import { UserData } from "services/User/User";
import LeftPlayerProfile from "./LeftPlayerProfile";
import RightPlayerProfile from "./RightPlayerProfile";
import { GameProperties } from "pages/Play/models/Properties";
import { useAppSelector } from "utils/redux/Store";

interface ProfilesHeaderProps {
  game: GameProperties;
  player1Data: UserData | null;
  player2Data: UserData | null;
}

const ProfilesHeader: React.FC<ProfilesHeaderProps> = ({ game, player1Data, player2Data }) => {
  const { noGame } = useAppSelector(store => store.rightScreen)
  
  return (
    <>
      {!noGame &&
        <article className='profile-infos-container glow-border' id='profile-card' style={{ width: `${game.board.width}px` }}>
          <LeftPlayerProfile player1Data={player1Data} />
          <div className="versus-text" style={{ verticalAlign: 'center' }}>VS</div>
          <RightPlayerProfile player2Data={player2Data} />
        </article>}
    </>
  );
}

export default ProfilesHeader;