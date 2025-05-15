"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthState {
  keyId: string | null;
  contractId: string | null;
  setKeyId: (keyId: string | null) => void;
  setContractId: (contractId: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const LOCAL_STORAGE_KEY_ID = "starbounty:keyId";
// const LOCAL_STORAGE_CONTRACT_ID = "starbounty:contractId"; // If you want to persist contractId

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [keyId, _setKeyId] = useState<string | null>(null);
  const [contractId, _setContractId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from localStorage on initial client-side mount
    const storedKeyId = localStorage.getItem(LOCAL_STORAGE_KEY_ID);
    if (storedKeyId) {
      _setKeyId(storedKeyId);
    }
    // Optionally load contractId from localStorage too if needed
    // const storedContractId = localStorage.getItem(LOCAL_STORAGE_CONTRACT_ID);
    // if (storedContractId) {
    //   _setContractId(storedContractId);
    // }
    setIsInitialized(true);
  }, []);

  const setKeyId = (newKeyId: string | null) => {
    _setKeyId(newKeyId);
    if (newKeyId) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ID, newKeyId);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ID);
    }
  };

  const setContractId = (newContractId: string | null) => {
    _setContractId(newContractId);
    // if (newContractId) {
    //   localStorage.setItem(LOCAL_STORAGE_CONTRACT_ID, newContractId);
    // } else {
    //   localStorage.removeItem(LOCAL_STORAGE_CONTRACT_ID);
    // }
  };

  const logout = () => {
    setKeyId(null);
    setContractId(null);
    // Optionally clear other related storage or session items.
    // Consider location.reload() if that fits your UX, like in the demo.
  };

  const isAuthenticated = !!keyId && !!contractId; // Or just !!keyId, depending on your app's logic

  if (!isInitialized) {
    return null; // Or a loading spinner, to prevent flicker before localStorage is read
  }

  return (
    <AuthContext.Provider value={{ keyId, contractId, setKeyId, setContractId, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 