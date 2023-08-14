import bg from "../images/bg4.jpg"
import { Link, useNavigate } from 'react-router-dom';
import GameBoard from '../game/components/GameBoard';
import "../game/components/GameStyles.css"

const myStyle={
    backgroundImage:
    "url('../images/bg4.jpg')",
    height: '100vh',
    marginTop:'-70px',
    marginBottom: '-70px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
};

export const Play = () => {
    
    return (
        <div className="page-container">
            {/* <GameBoard /> */}
            PLAY
            <Link to='/users/all'>GO TO LEADERBOARD</Link>
        </div>
    )
}
