'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

interface TodoProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export function Todo({ todo, onToggle, onDelete, onEdit }: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEditSave = () => {
    if (editText.trim() !== '') {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="p-4 flex items-center justify-between">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1"
            />
            <Button size="sm" onClick={handleEditSave}>保存</Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(false);
              }}
            >
              キャンセル
            </Button>
          </div>
        ) : (
          <>
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
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-blue-500"
                disabled={todo.completed}
              >
                編集
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(todo.id)}
                className="text-gray-500 hover:text-red-500"
              >
                削除
              </Button>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
} 
