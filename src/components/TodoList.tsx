"use client";

import React, { useState, useEffect } from "react";
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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all"
  );

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching todos:", error);
      return;
    }

    setTodos(data || []);
    if (data && data.length > 0) {
      toast.success(`${data.length}件のTODOを読み込みました`);
    }
    setIsLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const { error } = await supabase
      .from("todos")
      .insert([{ title: newTodo.trim() }]);

    if (error) {
      console.error("Error adding todo:", error);
      toast.error("TODOの追加に失敗しました");
      return;
    }

    setNewTodo("");
    fetchTodos();
  }

  async function toggleTodo(todo: Todo) {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id);

    if (error) {
      console.error("Error toggling todo:", error);
      toast.error("TODOの状態変更に失敗しました");
      return;
    }

    fetchTodos();
  }

  async function deleteTodo(id: string) {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
      toast.error("TODOの削除に失敗しました");
      return;
    }

    fetchTodos();
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo(e);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("すべてのTODOを削除しますか？")) {
      try {
        const { error } = await supabase
          .from("todos")
          .delete()
          .in(
            "id",
            todos.map((todo) => todo.id)
          );

        if (error) {
          throw error;
        }

        toast.success("すべてのTODOを削除しました");
        fetchTodos();
      } catch (error) {
        console.error("TODOの削除に失敗しました:", error);
        toast.error("TODOの削除に失敗しました");
      }
    }
  };

  // タブ変更時のハンドラ
  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "active" | "completed");
  };

  // 現在のタブに基づいてフィルタリングされたTODO
  const filteredTodos = todos.filter((todo) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return !todo.completed;
    if (activeTab === "completed") return todo.completed;
    return true;
  });

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

        <TabsContent value="all" className="mt-0">
          <TodoListContent
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onClearAll={handleClearAll}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <TodoListContent
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onClearAll={handleClearAll}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
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

function TodoListContent({
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
}
