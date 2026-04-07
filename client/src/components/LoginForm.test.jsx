import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  test('allows a user to type an email and password', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'student@example.com');
    await user.type(passwordInput, 'super-secret-password');

    expect(emailInput).toHaveValue('student@example.com');
    expect(passwordInput).toHaveValue('super-secret-password');
  });

  test('submits the typed credentials on the happy path', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'student@example.com');
    await user.type(screen.getByLabelText(/password/i), 'super-secret-password');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(handleSubmit).toHaveBeenCalled();
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'student@example.com',
      password: 'super-secret-password',
    });
  });

  test('shows a validation error and does not submit when fields are empty', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please provide email and password.'
    );
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
