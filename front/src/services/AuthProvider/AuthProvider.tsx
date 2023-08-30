import { createContext, useState, ReactNode } from "react";

type Auth = {
    email: string;
    password: string;
    accessToken: string;
};

type AuthContextType = {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
};

const AuthContext = createContext<AuthContextType>({
    auth: { email: '', password: '', accessToken: '' },
    setAuth: () => { }
});

type AuthProviderProps = {
    children: ReactNode; // Specify the type of 'children' prop as ReactNode
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<Auth>({ email: '', password: '', accessToken: '' });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
