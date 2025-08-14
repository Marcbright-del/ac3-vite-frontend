// src/pages/LoginPage.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from './LoginPage';

test('renders login page with username, password, and login button', () => {
  // Arrange: Render the component
  // We must wrap it in the providers it needs to work (Router and AuthContext)
  render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );

  // Act & Assert: Find the elements on the screen
  // Find the username input by its label
  const usernameInput = screen.getByLabelText(/username/i);
  expect(usernameInput).toBeInTheDocument();

  // Find the password input by its placeholder text
  const passwordInput = screen.getByPlaceholderText(/enter password/i);
  expect(passwordInput).toBeInTheDocument();

  // Find the login button by its role and name
  const loginButton = screen.getByRole('button', { name: /login/i });
  expect(loginButton).toBeInTheDocument();
});