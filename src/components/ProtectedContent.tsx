"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "./auth/AuthForm";
import { ProfileButton } from "./auth/ProfileButton";

interface ProtectedContentProps {
  children: React.ReactNode;
}

export function ProtectedContent({ children }: ProtectedContentProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
          <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
          <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-end mb-4">
        <ProfileButton />
      </div>
      {children}
    </div>
  );
}
