"use client";

import { useCallback, useEffect, useState } from "react";
import swal from "sweetalert";

import axios from "@/utils/axios";
import UserContext from "@/context/UserContext";
import { User } from "@/types/User";

interface UserContextProviderProps {
  children: React.ReactNode;
}

const UserContextProvider: React.FunctionComponent<UserContextProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  const checkContext = useCallback(() => {
    setIsLoading(true);
    axios
      .get<{ isLoggedIn: boolean; user?: User }>("/api/auth/verify", {withCredentials: true})
      .then(({ data }) => {
        if (data.isLoggedIn) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(undefined);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(undefined);
        setIsLoading(false);
        
        swal({
          text: "Something went wrong while checking authentication status.",
          icon: "warning",
        });
      });
  }, []);

  useEffect(() => {
    checkContext();
  }, [checkContext]);

  return (
    <UserContext.Provider
      value={{ isLoading, isAuthenticated, user, checkContext }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
