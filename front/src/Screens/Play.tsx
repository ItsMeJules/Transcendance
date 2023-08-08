import { Link } from 'react-router-dom';


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
            PLAY
            <Link to='/users/all'>GO TO LEADERBOARD</Link>
        </div>
    )
}