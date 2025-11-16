import { createContext, useContext, useState, type ReactNode } from 'react';

export interface UserContextType {
    username: string | null;
    login: (name: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? saved : null;
    });

    const login = (name: string) => {
        if (name.trim() === "") {
            return;
        }
        localStorage.setItem("user", name.trim());
        setUsername(name.trim());
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUsername(null);
    };

    return (
        <UserContext.Provider value={{ username, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// export const useUser = () => {
//     const context = useContext(UserContext);
//     if (context === undefined) {
//         throw new Error('useUser must be used within a UserProvider');
//     }
//     return context;
// };