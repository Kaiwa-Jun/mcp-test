# Todo アプリケーション

シンプルで使いやすい Todo アプリケーションです。タスク管理を効率的に行うことができます。

## 機能

- ユーザー認証（ログイン、サインアップ、ログアウト）
- タスクの追加、編集、削除
- タスクの完了/未完了の切り替え
- タスク一覧の表示（全て、未完了、完了済み）
- モバイルフレンドリーなレスポンシブデザイン
- ダークモード対応

## 技術スタック

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase（データベース、認証）
- Framer Motion（アニメーション）

## 開発方法

1. リポジトリをクローン

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

2. 依存関係のインストール

```bash
npm install
```

3. 開発サーバーの起動

```bash
npm run dev
```

4. ブラウザで http://localhost:3000 にアクセス

## Supabase のセットアップ

1. [Supabase](https://supabase.com/) でアカウントを作成
2. 新しいプロジェクトを作成
3. 以下の SQL を実行してテーブルを作成:

```sql
CREATE TABLE public.todos (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own todos" ON public.todos
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" ON public.todos
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" ON public.todos
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" ON public.todos
FOR DELETE USING (auth.uid() = user_id);
```

4. `.env.local` ファイルを作成し、Supabase の接続情報を設定:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 認証機能

このアプリケーションは Supabase Authentication を使用して以下の認証機能を提供しています：

- メール/パスワードでのユーザー登録
- ログイン/ログアウト
- パスワードリセット
- ユーザーごとの TODO 管理（Row Level Security）

認証状態に基づいて、ユーザーは自分の TODO のみを表示・編集できるようになっています。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## CI/CD

このプロジェクトでは以下の CI/CD パイプラインを実装しています：

- **CI（継続的インテグレーション）**: プルリクエストと main ブランチへのプッシュ時に自動的にテストとリントチェックが実行されます
- **CD（継続的デリバリー）**: main ブランチへのマージ時に自動的に Vercel へデプロイされます

### 必要な環境変数

Vercel へのデプロイには以下の GitHub Secrets が必要です：

- `VERCEL_TOKEN`: Vercel API トークン
- `VERCEL_PROJECT_ID`: Vercel プロジェクト ID
- `VERCEL_ORG_ID`: Vercel 組織 ID

### CI/CD 動作確認済み

CI/CD パイプラインは正常に動作しています！

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
