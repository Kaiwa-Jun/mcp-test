'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, TodoItem } from './Todo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const newTodoItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

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
