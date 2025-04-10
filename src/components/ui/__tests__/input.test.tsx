import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('applies additional className', () => {
    render(<Input className="custom-class" placeholder="Custom class" />);
    
    const input = screen.getByPlaceholderText('Custom class');
    expect(input).toHaveClass('custom-class');
  });

  it('supports disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('responds to user input', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    
    render(<Input onChange={onChange} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello');
    
    expect(onChange).toHaveBeenCalledTimes(5); // 5 characters
  });

  it('passes through other props', () => {
    render(
      <Input 
        data-testid="test-input"
        aria-label="Test input"
        maxLength={10}
        placeholder="Props test"
      />
    );
    
    const input = screen.getByPlaceholderText('Props test');
    expect(input).toHaveAttribute('data-testid', 'test-input');
    expect(input).toHaveAttribute('aria-label', 'Test input');
    expect(input).toHaveAttribute('maxlength', '10');
  });

  it('renders with default value', () => {
    render(<Input defaultValue="Default text" />);
    
    const input = screen.getByDisplayValue('Default text');
    expect(input).toBeInTheDocument();
  });

  it('renders with controlled value', () => {
    render(<Input value="Controlled value" onChange={() => {}} />);
    
    const input = screen.getByDisplayValue('Controlled value');
    expect(input).toBeInTheDocument();
  });
}); 
