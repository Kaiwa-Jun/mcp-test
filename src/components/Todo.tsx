'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

interface TodoProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Todo({ todo, onToggle, onDelete }: TodoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
          />
          <label
            htmlFor={`todo-${todo.id}`}
            className={`text-sm ${todo.completed ? 'line-through text-gray-500' : ''}`}
          >
            {todo.text}
          </label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(todo.id)}
          className="text-gray-500 hover:text-red-500"
        >
          削除
        </Button>
      </Card>
    </motion.div>
  );
} 
