import bg from "../images/bg4.jpg"
import { Link, useNavigate } from 'react-router-dom';
import GameBoard from '../game/components/GameBoard';
import "../game/components/GameStyles.css"

const myStyle={
    backgroundImage:
    "url('../images/bg4.jpg')",
    height: '100vh',
    // width: 'w-screen',
    marginTop:'-70px',
    marginBottom: '-70px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
};

export const Play = () => {
    
    return (
        // <div style={{backgroundImage: bg}}></div>
        <div className="page-container">
            <GameBoard />
            PLAY
            <Link to='/users/all'>GO TO LEADERBOARD</Link>
            {/* <img src={bg} alt="" /> */}
            {/* <img src={`url(${process.env.PUBLIC_URL + '/images/bg4.jpg'})`} /> */}
        </div>
    )
}