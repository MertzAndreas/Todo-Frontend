"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getTokenFromStorage,
  isTokenExpired,
  removeTokenFromStorage,
  setTokenInStorage,
} from "@/utils/token";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/app/Account/Login/page";
import { RegisterForm } from "@/app/Account/Register/page";

interface AuthContextType {
  isAuthenticated: boolean | null;
  getToken: () => Promise<string>;
  login: (form: LoginForm) => Promise<void>;
  logOut: () => void;
  register: (form: RegisterForm) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const fetchNewToken = async () => {
  const response = await fetch(`http://localhost:5040/Account/refresh-token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to refresh token");
  }
  return data.accessToken;
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  /*This solution is kind of a hack, but it works.
        It ensures that the method is not called on the server side which would cause an error */
  if (isAuthenticated === null && typeof window !== "undefined") {
    initialAuthState();
  }

  const login = async (form: LoginForm) => {
    const res = await fetch("http://localhost:5040/Account/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await res.json();
    setTokenInStorage(data.accessToken);
    setIsAuthenticated(true);
    router.push("/Dashboard");
  };

  const register = async (form: RegisterForm) => {
    const res = await fetch("http://localhost:5040/Account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await res.json();
    setTokenInStorage(data.accessToken);
    setIsAuthenticated(true);
    router.push("/Dashboard");
  };

  const logOut = () => {
    setIsAuthenticated(false);
    removeTokenFromStorage();
    // TODO: Implement invalidation of refresh token on backend upon logout
    router.push("/Account/Login");
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const newToken = await fetchNewToken();
      setTokenInStorage(newToken);
      setIsAuthenticated(true);
      return newToken;
    } catch (error) {
      removeTokenFromStorage();
      setIsAuthenticated(false);
      throw new Error("Failed to refresh token");
    }
  }, []);

  const getToken = useCallback(async () => {
    try {
      const storedToken = getTokenFromStorage();
      if (storedToken && !isTokenExpired(storedToken)) {
        return storedToken;
      }
      return await refreshAccessToken();
    } catch (error) {
      console.error("Error getting token:", error);
    }
  }, [refreshAccessToken]);

  async function initialAuthState(): Promise<void> {
    try {
      const storedToken = getTokenFromStorage();
      if (storedToken && !isTokenExpired(storedToken)) {
        return setIsAuthenticated(true);
      }
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        return setIsAuthenticated(true);
      }

      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error initializing authentication state:", error);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    const validateToken = async () => {
      try {
        await getToken();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        removeTokenFromStorage();
      }
    };

    validateToken();
  }, [getToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, getToken, login, logOut, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default useAuthContext;
