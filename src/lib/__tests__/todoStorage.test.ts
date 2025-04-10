import { getTodos, saveTodos, clearTodos } from '../todoStorage';
import { TodoItem } from '@/components/Todo';

describe('Todo Storage', () => {
  const mockTodos: TodoItem[] = [
    { id: '1', text: 'Test Todo 1', completed: false },
    { id: '2', text: 'Test Todo 2', completed: true },
  ];

  beforeEach(() => {
    // 各テスト前にlocalStorageをクリア
    localStorage.clear();
    
    // すべてのモックをリセット
    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should return an empty array if no todos in localStorage', () => {
      const todos = getTodos();
      expect(todos).toEqual([]);
      expect(localStorage.getItem).toHaveBeenCalledWith('todo-app-items');
    });

    it('should return todos from localStorage', () => {
      localStorage.setItem('todo-app-items', JSON.stringify(mockTodos));
      const todos = getTodos();
      expect(todos).toEqual(mockTodos);
      expect(localStorage.getItem).toHaveBeenCalledWith('todo-app-items');
    });

    it('should handle parse errors and return empty array', () => {
      localStorage.setItem('todo-app-items', 'invalid-json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const todos = getTodos();
      
      expect(todos).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('saveTodos', () => {
    it('should save todos to localStorage', () => {
      saveTodos(mockTodos);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'todo-app-items',
        JSON.stringify(mockTodos)
      );
    });

    it('should handle errors when saving', () => {
      // setItemがエラーをスローするようにモック
      const mockSetItem = jest.fn().mockImplementation(() => {
        throw 'Test error';
      });
      
      // 元のメソッドを保存
      const originalSetItem = localStorage.setItem;
      
      // テスト用にモックに置き換え
      localStorage.setItem = mockSetItem;
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      saveTodos(mockTodos);
      
      expect(consoleSpy).toHaveBeenCalledWith('TODOデータの保存に失敗しました:', 'Test error');
      
      // 後処理: 元のメソッドに戻す
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });
  
  describe('clearTodos', () => {
    it('should remove todos from localStorage', () => {
      // removeItemのモックを作成
      const mockRemoveItem = jest.fn();
      
      // 元のメソッドを保存
      const originalRemoveItem = localStorage.removeItem;
      
      // テスト用にモックに置き換え
      localStorage.removeItem = mockRemoveItem;
      
      clearTodos();
      
      expect(mockRemoveItem).toHaveBeenCalledWith('todo-app-items');
      
      // 後処理: 元のメソッドに戻す
      localStorage.removeItem = originalRemoveItem;
    });
    
    it('should handle errors when clearing', () => {
      // removeItemがエラーをスローするようにモック
      const mockRemoveItem = jest.fn().mockImplementation(() => {
        throw 'Test error';
      });
      
      // 元のメソッドを保存
      const originalRemoveItem = localStorage.removeItem;
      
      // テスト用にモックに置き換え
      localStorage.removeItem = mockRemoveItem;
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      clearTodos();
      
      expect(consoleSpy).toHaveBeenCalledWith('TODOデータの削除に失敗しました:', 'Test error');
      
      // 後処理: 元のメソッドに戻す
      localStorage.removeItem = originalRemoveItem;
      consoleSpy.mockRestore();
    });
  });
}); 
