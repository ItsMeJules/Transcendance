import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface UserData {
    id: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
    profilePicture: string | null;
}

class User {
    private static instance: User;
    private id: string | null = null;
    private createdAt: string | null = null;
    private updatedAt: string | null = null;
    private email: string | null = null;
    private firstName: string | null = null;
    private lastName: string | null = null;
    private userName: string | null = null;
    private profilePicture: string | null = null;
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
        // const data: UserData | null = JSON.parse(localStorage.getItem('userData') || 'null');
        // if (data) {
        this.id = data.id || null;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
        this.email = data.email || null;
        this.firstName = data.firstName || null;
        this.lastName = data.lastName || null;
        this.userName = data.userName || null;
        this.profilePicture = data.profilePicture || null;
        // }
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
            userName: this.userName,
            profilePicture: this.profilePicture,
        });
    }

    getId(): string {
        if (this.id){
            return this.id;
        } else {
            return "";
        }
    }

    getEmail(): string {
        if (this.email){
            return this.email;
        } else {
            return "";
        }
    }

    getUsername(): string {
        if (this.userName){
            return this.userName;
        } else {
            return "";
        }
    }

    getFirstName(): string {
        if (this.firstName){
            return this.firstName;
        } else {
            return "";
        }
    }

    getLastName(): string {
        if (this.lastName){
            return this.lastName;
        } else {
            return "";
        }
    }

    getProfilePicture(): string {
        if (this.profilePicture){
            return this.profilePicture;
        } else {
            return "";
        }
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