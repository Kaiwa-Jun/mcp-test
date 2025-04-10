import { cn } from '../utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('test', 'class')).toBe('test class');
      expect(cn('test', { class: true })).toBe('test class');
      expect(cn('test', { class: false })).toBe('test');
      expect(cn('test', ['class1', 'class2'])).toBe('test class1 class2');
    });

    it('should handle conditional class names', () => {
      const isActive = true;
      const isPrimary = false;
      
      expect(cn(
        'base-class',
        isActive && 'active',
        isPrimary && 'primary'
      )).toBe('base-class active');
    });

    it('should handle Tailwind CSS class conflicts correctly', () => {
      // tailwind-mergeの機能をテスト
      // 競合するクラスがある場合、後ろのものが優先される
      expect(cn(
        'text-red-500',
        'text-blue-500'
      )).toBe('text-blue-500');
      
      expect(cn(
        'p-4',
        'px-6'
      )).toBe('p-4 px-6');
    });
  });
}); 
