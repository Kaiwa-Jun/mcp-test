'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, TodoItem } from './Todo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTodos, saveTodos, clearTodos } from '@/lib/todoStorage';
import { toast } from 'sonner';

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto flex justify-center p-8">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="p-4">
        <div className="flex space-x-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="新しいTODOを入力..."
            className="flex-1"
          />
          <Button onClick={addTodo}>追加</Button>
        </div>
      </Card>

      <AnimatePresence>
        {todos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {todos.map(todo => (
              <Todo
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleClearAll}
                className="text-xs"
              >
                すべて削除
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-4 text-gray-500"
          >
            TODOがありません。新しいTODOを追加してください。
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
