import { TodoList } from "@/components/TodoList";
import { ProtectedContent } from "@/components/ProtectedContent";

export default function Home() {
  return (
    <div className="max-w-lg w-full mx-auto">
      <h1 className="text-4xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">
        TODO アプリ
      </h1>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
        あなたのタスクを効率的に管理
      </p>
      <ProtectedContent>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <TodoList />
        </div>
      </ProtectedContent>
    </div>
  );
}
