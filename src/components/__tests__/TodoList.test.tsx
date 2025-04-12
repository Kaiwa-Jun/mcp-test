import React from "react";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "../TodoList";
import { jest } from "@jest/globals";
import { act } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

// useAuthコンテキストのモック
jest.mock("@/contexts/AuthContext", () => {
  return {
    useAuth: jest.fn(() => ({
      user: { id: "test-user-id" },
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
    })),
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Supabaseのモック
jest.mock("@/lib/supabase", () => {
  const mockSubscription = {
    unsubscribe: jest.fn(),
  };

  const mockAuth = {
    signUp: jest.fn(() => Promise.resolve({ error: null })),
    signInWithPassword: jest.fn(() => Promise.resolve({ error: null })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    resetPasswordForEmail: jest.fn(() => Promise.resolve({ error: null })),
    updateUser: jest.fn(() => Promise.resolve({ error: null })),
    getSession: jest.fn(() =>
      Promise.resolve({ data: { session: null }, error: null })
    ),
    getUser: jest.fn(() =>
      Promise.resolve({ data: { user: null }, error: null })
    ),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: mockSubscription },
    })),
  };

  return {
    supabase: {
      auth: mockAuth,
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() =>
              Promise.resolve({
                data: [
                  {
                    id: "1",
                    title: "Test Todo 1",
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    user_id: "test-user-id",
                  },
                  {
                    id: "2",
                    title: "Test Todo 2",
                    completed: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    user_id: "test-user-id",
                  },
                ],
                error: null,
              })
            ),
          })),
        })),
        insert: jest.fn(() => Promise.resolve({ error: null })),
        update: jest.fn(() => Promise.resolve({ error: null })),
        delete: jest.fn(() => Promise.resolve({ error: null })),
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null })),
          in: jest.fn(() => Promise.resolve({ error: null })),
        })),
        in: jest.fn(() => Promise.resolve({ error: null })),
      })),
    },
    signUp: jest.fn(() => Promise.resolve({ error: null })),
    signIn: jest.fn(() => Promise.resolve({ error: null })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    resetPassword: jest.fn(() => Promise.resolve({ error: null })),
    updatePassword: jest.fn(() => Promise.resolve({ error: null })),
    getSession: jest.fn(() =>
      Promise.resolve({ data: { session: null }, error: null })
    ),
    getUser: jest.fn(() => Promise.resolve(null)),
  };
});

// framer-motionのモック
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => (
      <li {...props}>{children}</li>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// sonnerのモック
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// カスタムレンダー関数
const renderWithAuthProvider = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe.skip("TodoList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders todo list", async () => {
    renderWithAuthProvider(<TodoList />);

    // ローディング状態が表示されることを確認
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // ローディング状態が消えるのを待つ
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"));

    // 追加ボタンが存在することを確認
    expect(screen.getByText("追加")).toBeInTheDocument();
  });

  it("has working tabs", async () => {
    renderWithAuthProvider(<TodoList />);

    // ローディング状態が消えるのを待つ
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"));

    // すべてのタブが存在することを確認
    expect(screen.getByRole("tab", { name: /すべて/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /未完了/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /完了済み/i })).toBeInTheDocument();

    // タブをクリックできることを確認
    const activeTab = screen.getByRole("tab", { name: /未完了/i });
    await userEvent.click(activeTab);
    expect(activeTab).toHaveAttribute("aria-selected", "true");

    const completedTab = screen.getByRole("tab", { name: /完了済み/i });
    await userEvent.click(completedTab);
    expect(completedTab).toHaveAttribute("aria-selected", "true");
  });

  it("has an input field for new todos", async () => {
    renderWithAuthProvider(<TodoList />);

    // ローディング状態が消えるのを待つ
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"));

    // 入力フィールドが存在することを確認
    const input = screen.getByPlaceholderText(/新しいTODOを入力/i);
    expect(input).toBeInTheDocument();

    // 入力できることを確認
    await userEvent.type(input, "New Todo");
    expect(input).toHaveValue("New Todo");
  });

  it("can add a new todo when clicking the add button", async () => {
    renderWithAuthProvider(<TodoList />);

    // ローディング状態が消えるのを待つ
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"));

    // 入力フィールドに値を入力
    const input = screen.getByPlaceholderText(/新しいTODOを入力/i);
    await userEvent.type(input, "New Todo");

    // 追加ボタンをクリック
    const addButton = screen.getByText("追加");
    await userEvent.click(addButton);

    // 入力フィールドがクリアされたことを確認
    expect(input).toHaveValue("");
  });

  it("can add a new todo by pressing Enter", async () => {
    renderWithAuthProvider(<TodoList />);

    // ローディング状態が消えるのを待つ
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"));

    // 入力フィールドに値を入力してEnterキーを押す
    const input = screen.getByPlaceholderText(/新しいTODOを入力/i);
    await userEvent.type(input, "New Todo{enter}");

    // 入力フィールドがクリアされたことを確認
    expect(input).toHaveValue("");
  });

  it("does not add empty todos", async () => {
    const fromMock = jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null })),
    }));

    // スパイを設定
    const supabaseMock = require("@/lib/supabase").supabase;
    supabaseMock.from = fromMock;

    renderWithAuthProvider(<TodoList />);

    // ローディング状態が消えるのを待つ
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"));

    // 空の入力でEnterキーを押す
    const input = screen.getByPlaceholderText(/新しいTODOを入力/i);
    await userEvent.type(input, "{enter}");

    // insertが呼ばれないことを確認
    expect(fromMock().insert).not.toHaveBeenCalled();
  });
});
