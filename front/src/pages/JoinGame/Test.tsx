import { useEffect, useState } from "react";
import axios from "axios";
import { sendMessage } from "../../services/Socket/Socket.io";
import { UserData } from "../../services/User/User";
import PlayButton from "../../Components/PlayButton";


export const Test2 = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [socketData, setSocketData] = useState('');
    const [inQueue, setInQueue] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        console.log('Socket data:', socketData);
    }, [socketData]);

    const handleMessage = async () => {
        sendMessage("LOOOOL");
    }

    return (
        <div>
            <header className="flex"
                style={{ flexDirection: 'column', zIndex: '1' }}>

                {/* <PlayButton gameMode={4} setSocketData={setSocketData}/> */}

                <button className="text-white border"
                    style={{ fontSize: '30px', marginTop: '20px', zIndex: '1' }}
                    onClick={handleMessage}>
                    Send socket message</button>

            </header>
        </div>
    )
}
