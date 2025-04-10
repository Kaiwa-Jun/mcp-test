'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, TodoItem } from './Todo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTodos, saveTodos, clearTodos } from '@/lib/todoStorage';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

// Tabsコンポーネントのインラインスタイル
type TabsProps = {
  defaultValue: string;
  className?: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
};

const Tabs: React.FC<TabsProps> = ({ defaultValue, className, onValueChange, children }) => {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className={`tabs ${className || ''}`} data-value={value}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            currentValue: value,
            onValueChange: handleValueChange
          });
        }
        return child;
      })}
    </div>
  );
};

type TabsListProps = {
  className?: string;
  children: React.ReactNode;
  currentValue?: string;
  onValueChange?: (value: string) => void;
};

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={`tabs-list ${className || ''}`}>
      {children}
    </div>
  );
};

type TabsTriggerProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
  currentValue?: string;
  onValueChange?: (value: string) => void;
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, currentValue, onValueChange }) => {
  const isActive = currentValue === value;
  
  return (
    <button
      className={`tabs-trigger ${isActive ? 'data-[state=active]' : ''} ${className || ''}`}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => onValueChange && onValueChange(value)}
    >
      {children}
    </button>
  );
};

type TabsContentProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
  currentValue?: string;
};

const TabsContent: React.FC<TabsContentProps> = ({ value, className, children, currentValue }) => {
  const isActive = currentValue === value;
  
  if (!isActive) return null;
  
  return (
    <div 
      className={`tabs-content ${className || ''}`}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </div>
  );
};

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

      <Tabs defaultValue="all" className="w-full" onValueChange={(value: string) => setActiveTab(value as 'all' | 'active' | 'completed')}>
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
