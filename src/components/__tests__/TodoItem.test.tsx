import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "../TodoItem";
import { jest } from "@jest/globals";

// framer-motionをモック
jest.mock("framer-motion", () => ({
  motion: {
    li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => (
      <li {...props}>{children}</li>
    ),
  },
}));

describe("TodoItem Component", () => {
  const mockTodo = {
    id: "1",
    title: "Test Todo",
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockHandleToggle = jest.fn();
  const mockHandleDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders todo item correctly", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockHandleToggle}
        onDelete={mockHandleDelete}
      />
    );

    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByRole("button", { name: /削除/i })).toBeInTheDocument();
  });

  it("calls onToggle when checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockHandleToggle}
        onDelete={mockHandleDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    // todoオブジェクト全体で呼び出されることを期待
    expect(mockHandleToggle).toHaveBeenCalledWith(mockTodo);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockHandleToggle}
        onDelete={mockHandleDelete}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /削除/i });
    await user.click(deleteButton);

    expect(mockHandleDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it("displays completed todo with appropriate styles", () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockHandleToggle}
        onDelete={mockHandleDelete}
      />
    );

    const todoText = screen.getByText("Test Todo");
    expect(todoText.className).toContain("line-through");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});
