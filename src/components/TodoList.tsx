"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TodoItem } from "./TodoItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getTodos, saveTodos, clearTodos } from "@/lib/todoStorage";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { useAuth } from "@/contexts/AuthContext";

// Alertコンポーネントのインラインスタイル
type AlertProps = {
  variant?: "default" | "destructive";
  className?: string;
  children: React.ReactNode;
};

const Alert: React.FC<AlertProps> = ({
  variant = "default",
  className,
  children,
}) => {
  return (
    <div className={`alert alert-${variant} ${className || ""}`}>
      {children}
    </div>
  );
};

type AlertDescriptionProps = {
  className?: string;
  children: React.ReactNode;
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className,
  children,
}) => {
  return (
    <div className={`alert-description ${className || ""}`}>{children}</div>
  );
};

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export function TodoList() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all"
  );

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching todos:", error);
      // エラーログのみ出力し、ユーザーにはトーストを表示しない
      setTodos([]);
      setIsLoading(false);
      return;
    }

    setTodos(data || []);
    if (data && data.length > 0) {
      toast.success(`${data.length}件のTODOを読み込みました`);
    }
    setIsLoading(false);
  }, [user?.id]);

  const addTodo = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodo.trim()) return;
      if (!user) {
        toast.error("ログインしてください");
        return;
      }

      const newTodoItem: Todo = {
        id: crypto.randomUUID(),
        title: newTodo.trim(),
        user_id: user.id,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: null,
        priority: null,
      };

      // 楽観的UIアップデート
      setTodos((prev) => [newTodoItem, ...prev]);
      setNewTodo("");

      const { error } = await supabase
        .from("todos")
        .insert([{ title: newTodo.trim(), user_id: user.id }]);

      if (error) {
        console.error("Error adding todo:", error);
        toast.error("TODOの追加に失敗しました");
        // エラー時は元の状態に戻す
        setTodos((prev) => prev.filter((todo) => todo.id !== newTodoItem.id));
        return;
      }

      // 追加成功後も再フェッチは必要なし（IDはサーバー側で生成されるため必要な場合はここでコメントアウトを外す）
      // fetchTodos();
    },
    [newTodo, user]
  );

  const toggleTodo = useCallback(
    async (todo: Todo) => {
      // 楽観的UIアップデート
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      );

      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", todo.id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error toggling todo:", error);
        toast.error("TODOの状態変更に失敗しました");
        // エラー時は元の状態に戻す
        setTodos((prev) =>
          prev.map((t) =>
            t.id === todo.id ? { ...t, completed: todo.completed } : t
          )
        );
        return;
      }
    },
    [user?.id]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      // 削除前のtodosを記憶
      const previousTodos = [...todos];

      // 楽観的UIアップデート
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error deleting todo:", error);
        toast.error("TODOの削除に失敗しました");
        // エラー時は元の状態に戻す
        setTodos(previousTodos);
        return;
      }
    },
    [todos, user?.id]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        addTodo(e);
      }
    },
    [addTodo]
  );

  const handleClearAll = useCallback(async () => {
    if (window.confirm("すべてのTODOを削除しますか？")) {
      // 削除前のtodosを記憶
      const previousTodos = [...todos];

      // 楽観的UIアップデート
      setTodos([]);

      try {
        const { error } = await supabase
          .from("todos")
          .delete()
          .eq("user_id", user?.id)
          .in(
            "id",
            previousTodos.map((todo) => todo.id)
          );

        if (error) {
          throw error;
        }

        toast.success("すべてのTODOを削除しました");
      } catch (error) {
        console.error("TODOの削除に失敗しました:", error);
        toast.error("TODOの削除に失敗しました");
        // エラー時は元の状態に戻す
        setTodos(previousTodos);
      }
    }
  }, [todos, user?.id]);

  // タブ変更時のハンドラ
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as "all" | "active" | "completed");
  }, []);

  // 現在のタブに基づいてフィルタリングされたTODO
  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) => {
        if (activeTab === "all") return true;
        if (activeTab === "active") return !todo.completed;
        if (activeTab === "completed") return todo.completed;
        return true;
      }),
    [todos, activeTab]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8" data-testid="loading">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
          <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
          <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <Card className="p-4 shadow-sm border-t-4 border-t-blue-500 dark:border-t-blue-400">
        <div className="flex space-x-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="新しいTODOを入力..."
            className="flex-1"
          />
          <Button
            onClick={addTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="mr-1 h-4 w-4" />
            追加
          </Button>
        </div>
      </Card>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="active">未完了</TabsTrigger>
          <TabsTrigger value="completed">完了済み</TabsTrigger>
        </TabsList>

        {/* 共通のコンテンツを1つのTabContentで共有 */}
        <TabsContent value={activeTab} className="mt-0">
          <TodoListContent
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onClearAll={handleClearAll}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TodoListContentProps {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const TodoListContent = React.memo(function TodoListContent({
  todos,
  onToggle,
  onDelete,
  onClearAll,
}: TodoListContentProps) {
  return (
    <AnimatePresence>
      {todos.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}

          <div className="flex justify-end mt-6">
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearAll}
              className="text-xs flex items-center"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              すべて削除
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Alert
            variant="default"
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <AlertDescription className="text-center py-6 text-slate-500 dark:text-slate-400">
              TODOがありません。新しいTODOを追加してください。
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
