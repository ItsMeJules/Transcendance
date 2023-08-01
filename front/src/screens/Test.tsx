import  { useState } from "react"
import { UserData } from "../services/user";


export const Test = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profilePicture, setProfilePicture] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handlebutton = () => {
        if (errMsg === "")
            setErrMsg('LOLOLO');
        else 
            setErrMsg("");
    }

    return (
        <div className=" justify-content-center flex"
            style={{ height: '100px', flexDirection: 'column' }}>

            <button onClick={handlebutton} className="border">
                BUTTON
            </button>
            <div>Error message: {errMsg}</div>

        </div>
    )
}