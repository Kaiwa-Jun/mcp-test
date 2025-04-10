import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Todo, TodoItem } from '../Todo';

// Framer Motionのモックはjest.setup.jsで定義済み

describe('Todo Component', () => {
  const mockTodo: TodoItem = {
    id: '1',
    text: 'Test Todo',
    completed: false
  };
  
  const mockHandlers = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo item correctly', () => {
    render(
      <Todo 
        todo={mockTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders completed todo with proper styling', () => {
    const completedTodo = { ...mockTodo, completed: true };
    
    render(
      <Todo 
        todo={completedTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    const label = screen.getByText('Test Todo');
    expect(label).toHaveClass('line-through');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('toggles todo completion status when checkbox is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Todo 
        todo={mockTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith('1');
  });

  it('shows edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Todo 
        todo={mockTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    // 編集ボタンをクリック
    const editButton = screen.getByRole('button', { name: /edit2/i });
    await user.click(editButton);
    
    // 編集モードのUI要素が表示されていることを確認
    const input = screen.getByDisplayValue('Test Todo');
    expect(input).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /x/i })).toBeInTheDocument();
  });

  it('saves edited todo text', async () => {
    const user = userEvent.setup();
    
    render(
      <Todo 
        todo={mockTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    // 編集モードに入る
    const editButton = screen.getByRole('button', { name: /edit2/i });
    await user.click(editButton);
    
    // テキストを編集
    const input = screen.getByDisplayValue('Test Todo');
    await user.clear(input);
    await user.type(input, 'Updated Todo');
    
    // 保存ボタンをクリック
    const saveButton = screen.getByRole('button', { name: /check/i });
    await user.click(saveButton);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1', 'Updated Todo');
  });

  it('cancels editing when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Todo 
        todo={mockTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    // 編集モードに入る
    const editButton = screen.getByRole('button', { name: /edit2/i });
    await user.click(editButton);
    
    // テキストを編集
    const input = screen.getByDisplayValue('Test Todo');
    await user.clear(input);
    await user.type(input, 'Should Not Save');
    
    // キャンセルボタンをクリック
    const cancelButton = screen.getByRole('button', { name: /x/i });
    await user.click(cancelButton);
    
    expect(mockHandlers.onEdit).not.toHaveBeenCalled();
    expect(screen.queryByDisplayValue('Should Not Save')).not.toBeInTheDocument();
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('handles delete confirmation workflow', async () => {
    const user = userEvent.setup();
    
    render(
      <Todo 
        todo={mockTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    // 削除ボタンをクリック (確認UI表示)
    const deleteButton = screen.getByRole('button', { name: /trash2/i });
    await user.click(deleteButton);
    
    // 確認UIが表示される
    expect(screen.getByText('削除しますか？')).toBeInTheDocument();
    
    // 削除確認ボタンをクリック
    const confirmButton = screen.getByRole('button', { name: /check/i });
    await user.click(confirmButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('cancels delete when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Todo 
        todo={mockTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    // 削除ボタンをクリック (確認UI表示)
    const deleteButton = screen.getByRole('button', { name: /trash2/i });
    await user.click(deleteButton);
    
    // キャンセルボタンをクリック
    const cancelButton = screen.getByRole('button', { name: /x/i });
    await user.click(cancelButton);
    
    expect(mockHandlers.onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText('削除しますか？')).not.toBeInTheDocument();
  });

  it('saves todo when Enter key is pressed', async () => {
    const user = userEvent.setup();
    
    render(
      <Todo 
        todo={mockTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    // 編集モードに入る
    const editButton = screen.getByRole('button', { name: /edit2/i });
    await user.click(editButton);
    
    // テキストを編集
    const input = screen.getByDisplayValue('Test Todo');
    await user.clear(input);
    await user.type(input, 'Updated With Enter{Enter}');
    
    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1', 'Updated With Enter');
  });

  it('disables edit button when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    
    render(
      <Todo 
        todo={completedTodo} 
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
      />
    );
    
    const editButton = screen.getByRole('button', { name: /edit2/i });
    expect(editButton).toBeDisabled();
  });
}); 
