'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(todo.id);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full"
      layout
    >
      <Card 
        className={cn(
          "p-4 transition-all duration-200 hover:shadow-md",
          todo.completed ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" : "bg-white dark:bg-gray-800",
          isEditing && "ring-2 ring-blue-500 dark:ring-blue-400"
        )}
      >
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleEditSave}
              className="h-8 w-8 bg-green-500 hover:bg-green-600 text-white"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(false);
              }}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => onToggle(todo.id)}
                  className={cn(
                    "transition-all duration-200 border-2",
                    todo.completed 
                      ? "border-green-500 bg-green-500 text-white" 
                      : "border-slate-300 dark:border-slate-600"
                  )}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={cn(
                    "text-sm transition-all duration-200 overflow-hidden text-ellipsis",
                    todo.completed 
                      ? "line-through text-slate-500 dark:text-slate-400" 
                      : "text-slate-800 dark:text-slate-200"
                  )}
                >
                  {todo.text}
                </label>
              </div>
              <div className="flex gap-1 ml-2">
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500 mr-2">削除しますか？</span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleDelete}
                      className="h-7 w-7"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="h-7 w-7"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                      disabled={todo.completed}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDelete}
                      className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
} 
