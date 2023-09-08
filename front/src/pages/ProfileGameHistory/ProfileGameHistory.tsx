import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { Link } from "react-router-dom";
import { GlowText } from 'utils/cssAnimation/cssAnimation';
import { API_ROUTES } from 'utils/routing/routing';
import { GameHistoryData } from 'services/Game/GameHistory';
import { FaLeftLong } from 'react-icons/fa6';
import { IconContext } from 'react-icons';

import { APP_ROUTES } from 'utils/routing/routing';

import './ProfileGameHistory.scss'

const ProfileGameHistory = () => {
  const customAxiosInstance = useAxios();

  const { id } = useParams();
  const location = useLocation();

  const [uid, setUid] = useState<string>("-1");
  const [gameHistory, setGameHistory] = useState<GameHistoryData[]>([]);
  const [isLoadingGameHistory, setIsLoadingGameHistory] = useState(true);

  useEffect(() => {

    const fetchUserGameHistory = async (id: string | undefined) => {

      try {
        const response = await customAxiosInstance.get(API_ROUTES.GENERIC_USER_PROFILE + id + API_ROUTES.GAME_HISTORY_SUFFIX,
        { withCredentials: true });
        setGameHistory(response.data.gameHistory);
        setIsLoadingGameHistory(false);

      } catch (err: any) {
        if (err.response?.status === 400) { };
      }
    };

    fetchUserGameHistory(id);
  
    const userDataJSON = localStorage.getItem("userData");
    const userData = userDataJSON ? JSON.parse(userDataJSON) : null;

    if (userData) {
      setUid(userData.id.toString());
    }

  }, [uid, id, location]);

  return (
    <>
      <section className="profile-main-container">

        { uid === id ? (
            <section className='header'>
              <Link className="icon" title="Back to profile" to={APP_ROUTES.USER_PROFILE_ABSOLUTE} style={{ padding: '0px' }}>
                <IconContext.Provider value={{ color: 'rgba(255, 255, 255, 0.5)', size: '30px' }}>
                  <FaLeftLong />
                </IconContext.Provider>
              </Link>
            </section>
          ) : (
            <section className='header'>
              <Link className="icon" title="Back to profile" to={APP_ROUTES.GENERIC_USER_PROFILE_ABSOLUTE + id} style={{ padding: '0px' }}>
                <IconContext.Provider value={{ color: 'rgba(255, 255, 255, 0.5)', size: '30px' }}>
                  <FaLeftLong />
                </IconContext.Provider>
              </Link>
            </section>
          )
        }

        {
          isLoadingGameHistory ? (
          <GlowText>Loading</GlowText>
          ) : (<>
            {
              gameHistory.length === 0 ? (
                <GlowText>No game history</GlowText>
                ) : (<>
                <GlowText>Game history</GlowText>
                {
                  gameHistory.map((game: GameHistoryData) => (
                    <ul className="game-history" key={game.id}>
                      <li className="game">
                        <img className="pp1" src={game.player1?.profilePicture} alt={game.player1?.username} />
                        <article className='central-text'>
                          <span className="p1" title={game.player1?.username}>{game.player1?.username}</span>
                          <span className="score ">{game.player1Score === -1 ? "Gave up" : game.player1Score} - {game.player2Score === -1 ? "Gave up" : game.player2Score}</span>
                          <span className="p2 " title={game.player2?.username}>{game.player2?.username}</span>
                        </article>
                        <img className="pp2" src={game.player2?.profilePicture} alt={game.player2?.username} />
                      </li>
                    </ul>
                  ))
                }
              </>)
            }
          </>)
        }
      </section>
    </>
  );
};

export default ProfileGameHistory;
