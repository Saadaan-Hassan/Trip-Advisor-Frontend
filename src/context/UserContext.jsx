import React, { useState, createContext, useContext, useEffect } from "react";
import useToken from "../hooks/useToken";
import useUser from "../hooks/useUser";
import useVendor from "../hooks/useVendor";
import useVendorToken from "../hooks/useVendorToken";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user, setUser } = useUser();
  const { token, setToken } = useToken();
  const { vendor, setVendor } = useVendor();
  const { vendorToken, setVendorToken } = useVendorToken();

  const login = (user, token) => {
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setVendor(null);
    setVendorToken(null);
  };

  const vendorLogin = (vendor, vendorToken) => {
    setVendor(vendor);
    setVendorToken(vendorToken);
  };

  const value = {
    user,
    setUser,
    token,
    login,
    logout,
    vendor,
    vendorToken,
    vendorLogin,
  };

  useEffect(() => {
    // Check if either user or token is null, then logout
    if (user === null || token === null) {
      logout();
    } else {
      // If both user and token are not null, then login
      login(user, token);
    }
  }, [user, token]); // Depend on both user and token

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
