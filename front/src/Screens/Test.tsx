import { UserData } from "../Services/user";
import { useState } from "react";
import axios from "axios";
import { connectSocket, disconnectSocket, sendMessage } from "../Websocket/Socket.io";


export const Test = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profilePicture, setProfilePicture] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handlebutton = async () => {
        const response = await axios.get('/api/main/test');
        console.log(response);
    }

    const handleSocket = async () => {
        connectSocket();
    }

    const handleDisconnectSocket = async () => {
        disconnectSocket();
    }

    const handleMessage = async () => {
        sendMessage("LOOOOL");
    }

    return (
        <div>
            <header className="flex"
                style={{ flexDirection: 'column', zIndex: '1' }}>
                <button className="text-white border border-white"
                    style={{ fontSize: '30px', zIndex: '1' }}
                    onClick={handleSocket}>
                    Connect socket</button>

                <button className="text-white border"
                    style={{ fontSize: '30px', marginTop: '20px', zIndex: '1' }}
                    onClick={handleDisconnectSocket}>
                    Disconnect socket</button>

                <button className="text-white border"
                    style={{ fontSize: '30px', marginTop: '20px', zIndex: '1' }}
                    onClick={handleMessage}>
                    Send socket message</button>

            </header>
        </div>
    )
}