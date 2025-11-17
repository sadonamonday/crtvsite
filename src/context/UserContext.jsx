import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user on page load
    const fetchUser = async () => {
        try {
            const res = await fetch(
                "https://crtvshotss.atwebpages.com/users/get_user.php",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!data.error && data.id) {
                setUser(data); // must contain user info
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setUser(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
