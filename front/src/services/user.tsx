import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface UserData {
    id: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    profilePicture: string | null;
    gamesPlayed: number | null;
    gamesWon: number | null;
    userPoints: number | null;
    userLevel: number | null;

}

class User {
    private static instance: User;
    private id: string | null = null;
    private createdAt: string | null = null;
    private updatedAt: string | null = null;
    private email: string | null = null;
    private firstName: string | null = null;
    private lastName: string | null = null;
    private username: string | null = null;
    private profilePicture: string | null = null;
    private gamesPlayed: number | null = null;
    private gamesWon: number | null = null;
    private userPoints: number | null = null;
    private userLevel: number | null = null;
    private accessToken: string | null = null;
    private axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create();
        this.accessToken = localStorage.getItem('accessToken');
        this.updateHeaders();
    }

    static getInstance() {
        if (!User.instance) {
            User.instance = new User();
        }
        return User.instance;
    }

    storeUserData(data: UserData) {
        localStorage.setItem('userData', JSON.stringify(data));
    }

    setUserFromResponseData(data: UserData) {
        this.id = data.id || null;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
        this.email = data.email || null;
        this.firstName = data.firstName || null;
        this.lastName = data.lastName || null;
        this.username = data.username || null;
        this.profilePicture = data.profilePicture || null;
        this.gamesPlayed = data.gamesPlayed || null;
        this.gamesWon = data.gamesWon || null;
        this.userPoints = data.userPoints || null;
        this.userLevel = data.userLevel || null;
    }

    setAccessToken(accessToken: string) {
        if (accessToken) {
            this.accessToken = accessToken;
            localStorage.setItem('accessToken', accessToken);
            this.updateHeaders();
        }
    }

    getDataFromStorage(userData: string) {
        return localStorage.getItem('userData');

    }

    getData(): UserData | null {
        return ({
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            profilePicture: this.profilePicture,
            gamesPlayed: this.gamesPlayed,
            gamesWon: this.gamesWon,
            userPoints: this.userPoints,
            userLevel: this.userLevel,
        });
    }

    getId(): string {
        if (this.id) {
            return this.id;
        } else {
            return "";
        }
    }

    getEmail(): string {
        if (this.email) {
            return this.email;
        } else {
            return "";
        }
    }

    getUsername(): string {
        if (this.username) {
            return this.username;
        } else {
            return "";
        }
    }

    getFirstName(): string {
        if (this.firstName) {
            return this.firstName;
        } else {
            return "";
        }
    }

    getLastName(): string {
        if (this.lastName) {
            return this.lastName;
        } else {
            return "";
        }
    }

    getProfilePicture(): string {
        if (this.profilePicture) {
            return this.profilePicture;
        } else {
            return "";
        }
    }

    getGamesPlayed(): number {
        if (this.gamesPlayed)
            return this.gamesPlayed;
        else
            return 0;
    }

    getGamesWon(): number {
        if (this.gamesWon)
            return this.gamesWon;
        else
            return 0;
    }

    getUserPoints(): number {
        if (this.userPoints)
            return this.userPoints;
        else
            return 0;
    }

    getUserLevel(): number {
        if (this.userLevel)
            return this.userLevel;
        else
            return 0;
    }
    
    getAccessToken(): string | null {
        return this.accessToken;
    }

    private updateHeaders() {
        if (this.accessToken) {
            this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ${this.accessToken}';
        } else {
            delete this.axiosInstance.defaults.headers.common['Authorization'];
        }
    }

    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}

export default User;