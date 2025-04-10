import { TodoItem } from '@/components/Todo';

const STORAGE_KEY = 'todo-app-items';

/**
 * ローカルストレージからTODOアイテムを取得する
 */
export const getTodos = (): TodoItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    return storedTodos ? JSON.parse(storedTodos) : [];
  } catch (error) {
    console.error('TODOデータの読み込みに失敗しました:', error);
    return [];
  }
};

/**
 * TODOアイテムをローカルストレージに保存する
 */
export const saveTodos = (todos: TodoItem[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('TODOデータの保存に失敗しました:', error);
  }
};

/**
 * ローカルストレージからTODOアイテムを削除する
 */
export const clearTodos = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('TODOデータの削除に失敗しました:', error);
  }
}; 
