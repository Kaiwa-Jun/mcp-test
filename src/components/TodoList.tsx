'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, TodoItem } from './Todo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getTodos, saveTodos, clearTodos } from '@/lib/todoStorage';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

// Alertコンポーネントのインラインスタイル
type AlertProps = {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
};

const Alert: React.FC<AlertProps> = ({ variant = 'default', className, children }) => {
  return (
    <div className={`alert alert-${variant} ${className || ''}`}>
      {children}
    </div>
  );
};

type AlertDescriptionProps = {
  className?: string;
  children: React.ReactNode;
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({ className, children }) => {
  return (
    <div className={`alert-description ${className || ''}`}>
      {children}
    </div>
  );
};

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  // アプリケーション起動時にローカルストレージからデータを読み込む
  useEffect(() => {
    const loadTodos = () => {
      try {
        const storedTodos = getTodos();
        setTodos(storedTodos);
        if (storedTodos.length > 0) {
          toast.success(`${storedTodos.length}件のTODOを読み込みました`);
        }
      } catch (error) {
        console.error('TODOデータの読み込みに失敗しました:', error);
        toast.error('TODOデータの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  // TODOが更新されたらローカルストレージに保存する
  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    try {
      const newTodoItem: TodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false
      };
      
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
      toast.success('TODOを追加しました');
    } catch (error) {
      console.error('TODOの追加に失敗しました:', error);
      toast.error('TODOの追加に失敗しました');
    }
  };

  const toggleTodo = (id: string) => {
    try {
      setTodos(
        todos.map(todo => {
          if (todo.id === id) {
            const updated = { ...todo, completed: !todo.completed };
            toast.success(updated.completed 
              ? `「${todo.text}」を完了しました` 
              : `「${todo.text}」を未完了に戻しました`);
            return updated;
          }
          return todo;
        })
      );
    } catch (error) {
      console.error('TODOの状態変更に失敗しました:', error);
      toast.error('TODOの状態変更に失敗しました');
    }
  };

  const deleteTodo = (id: string) => {
    try {
      const todoToDelete = todos.find(todo => todo.id === id);
      setTodos(todos.filter(todo => todo.id !== id));
      if (todoToDelete) {
        toast.success(`「${todoToDelete.text}」を削除しました`);
      }
    } catch (error) {
      console.error('TODOの削除に失敗しました:', error);
      toast.error('TODOの削除に失敗しました');
    }
  };

  const editTodo = (id: string, newText: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('すべてのTODOを削除しますか？')) {
      try {
        setTodos([]);
        clearTodos();
        toast.success('すべてのTODOを削除しました');
      } catch (error) {
        console.error('TODOの削除に失敗しました:', error);
        toast.error('TODOの削除に失敗しました');
      }
    }
  };

  // タブ変更時のハンドラ
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'active' | 'completed');
  };

  // 現在のタブに基づいてフィルタリングされたTODO
  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !todo.completed;
    if (activeTab === 'completed') return todo.completed;
    return true;
  });

  if (isLoading) {
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
          <Button onClick={addTodo} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="mr-1 h-4 w-4" />
            追加
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
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
            onEdit={editTodo} 
            onClearAll={handleClearAll}
          />
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <TodoListContent 
            todos={filteredTodos} 
            onToggle={toggleTodo} 
            onDelete={deleteTodo} 
            onEdit={editTodo} 
            onClearAll={handleClearAll}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <TodoListContent 
            todos={filteredTodos} 
            onToggle={toggleTodo} 
            onDelete={deleteTodo} 
            onEdit={editTodo} 
            onClearAll={handleClearAll}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TodoListContentProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onClearAll: () => void;
}

function TodoListContent({ todos, onToggle, onDelete, onEdit, onClearAll }: TodoListContentProps) {
  return (
    <AnimatePresence>
      {todos.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {todos.map(todo => (
            <Todo
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
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
          <Alert variant="default" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <AlertDescription className="text-center py-6 text-slate-500 dark:text-slate-400">
              TODOがありません。新しいTODOを追加してください。
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
