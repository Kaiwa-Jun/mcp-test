"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  supabase,
  signIn,
  signUp,
  signOut,
  resetPassword,
  getSession,
  getUser,
} from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初期ロード時に認証状態を確認
    const initAuth = async () => {
      try {
        const { data } = await getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("認証状態の確認中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const { error } = await signUp(email, password);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await resetPassword(email);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
