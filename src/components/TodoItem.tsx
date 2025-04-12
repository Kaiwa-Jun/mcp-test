import { motion } from "framer-motion";
import { Database } from "@/types/database.types";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

// テスト環境かどうかを判定
const isTest = process.env.NODE_ENV === "test";

// テスト環境用のモーションコンポーネント
const TestMotion = {
  li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => (
    <li {...props}>{children}</li>
  ),
};

// 使用するコンポーネントを環境によって切り替え
const MotionComponent = isTest ? TestMotion : motion;

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <MotionComponent.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-2 p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
    >
      <input
        type="checkbox"
        checked={todo.completed || false}
        onChange={() => onToggle(todo)}
        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
      />
      <span
        className={`flex-1 ${
          todo.completed
            ? "line-through text-gray-500 dark:text-gray-400"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-600 transition-colors"
      >
        削除
      </button>
    </MotionComponent.li>
  );
}
