import { TodoList } from '@/components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">TODO アプリ</h1>
        <TodoList />
      </div>
    </div>
  );
}
