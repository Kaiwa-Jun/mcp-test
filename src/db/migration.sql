-- todosテーブルにuser_idカラムを追加
ALTER TABLE todos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- user_idがNULLの既存レコードに対するインデックスを作成
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);

-- RLSポリシーを設定して、ユーザーが自分のデータのみにアクセスできるようにする
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- ユーザーがログインしている場合、自分のTODOのみを取得できるポリシー
CREATE POLICY "Users can view their own todos" ON todos
FOR SELECT USING (auth.uid() = user_id);

-- ユーザーが自分のTODOのみを挿入できるポリシー
CREATE POLICY "Users can insert their own todos" ON todos
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ユーザーが自分のTODOのみを更新できるポリシー
CREATE POLICY "Users can update their own todos" ON todos
FOR UPDATE USING (auth.uid() = user_id);

-- ユーザーが自分のTODOのみを削除できるポリシー
CREATE POLICY "Users can delete their own todos" ON todos
FOR DELETE USING (auth.uid() = user_id);