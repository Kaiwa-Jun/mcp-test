"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LogIn, UserPlus, Key } from "lucide-react";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (forgotPassword) {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast.success("パスワードリセットの手順をメールで送信しました");
        setForgotPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("ログインしました");
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success("登録確認メールを送信しました。メールを確認してください");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("認証エラー:", error);
      toast.error(error.message || "認証に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForgotPassword(false);
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
  };

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        {forgotPassword
          ? "パスワードをリセット"
          : isLogin
          ? "ログイン"
          : "アカウント登録"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            メールアドレス
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            required
          />
        </div>

        {!forgotPassword && (
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              パスワード
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              required
            />
          </div>
        )}

        {isLogin && !forgotPassword && (
          <div className="text-right">
            <button
              type="button"
              onClick={toggleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              パスワードをお忘れですか？
            </button>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span>処理中...</span>
          ) : forgotPassword ? (
            <>
              <Key className="mr-2 h-4 w-4" />
              リセットリンクを送信
            </>
          ) : isLogin ? (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              ログイン
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              登録
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={toggleMode}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {forgotPassword
            ? "ログインに戻る"
            : isLogin
            ? "アカウントをお持ちでないですか？ 登録する"
            : "すでにアカウントをお持ちですか？ ログイン"}
        </button>
      </div>
    </Card>
  );
}
