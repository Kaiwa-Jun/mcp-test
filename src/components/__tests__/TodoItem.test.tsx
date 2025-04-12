import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "../TodoItem";
import { vi } from "vitest";

describe("TodoItem Component", () => {
  const mockTodo = {
    id: "1",
    title: "Test Todo",
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockHandleToggle = vi.fn();
  const mockHandleDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(mockHandleToggle).toHaveBeenCalledWith(mockTodo.id);
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
    expect(todoText).toHaveStyle({ textDecoration: "line-through" });
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});
