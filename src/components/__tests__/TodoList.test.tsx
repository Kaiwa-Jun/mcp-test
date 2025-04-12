import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "../TodoList";
import { jest } from "@jest/globals";

// Supabaseのモック
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      data: [
        {
          id: "1",
          title: "Test Todo 1",
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Test Todo 2",
          completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      error: null,
    })),
  })),
}));

// sonnerのモック
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("TodoList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders todo list correctly", async () => {
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    });
  });

  it("filters todos based on active tab", async () => {
    render(<TodoList />);

    const user = userEvent.setup();

    // 完了済みタブをクリック
    const completedTab = screen.getByRole("tab", { name: /完了済み/i });
    await user.click(completedTab);

    await waitFor(() => {
      expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    });
  });

  it("adds a new todo", async () => {
    render(<TodoList />);

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/新しいタスクを入力/i);
    await user.type(input, "New Todo{enter}");

    await waitFor(() => {
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });
  });
});
