"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";

export function ProfileButton() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      toast.success("ログアウトしました");
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
      toast.error("ログアウトに失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium hidden sm:inline">{user.email}</span>
      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleSignOut}
        >
          <User className="h-5 w-5" />
        </Button>
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
              {user.email}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
