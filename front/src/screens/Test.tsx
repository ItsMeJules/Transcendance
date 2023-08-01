import React, { useEffect, useState } from "react"
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { Link } from "react-router-dom";
import axios from "axios";
import { UserData } from "../services/user";
import User from "../services/user";
import ToastErrorMessage from "../components/ToastErrorMessage";


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