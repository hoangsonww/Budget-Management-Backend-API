import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as auth from './services/auth';

// --- Test the React App routing + layout ---
describe('<App />', () => {
  beforeEach(() => localStorage.clear());

  it('renders Navbar and Footer on home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Navbar has role=banner
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer has role=contentinfo
    // Home page heading
    expect(screen.getByText(/welcome to your budget app/i)).toBeInTheDocument();
  });

  it('navigates to not-found on an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/totally-bogus']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('protects /profile route when not logged in', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    );
    // Should redirect to /login
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('allows /login and /register and /forgot-password', () => {
    ['/login', '/register', '/forgot-password'].forEach(path => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      );
      // There should be a submit button on each
      expect(screen.getByRole('button', { name: /submit|login|register|reset/i })).toBeInTheDocument();
    });
  });
});

// --- Test services/auth.js ---
describe('services/auth', () => {
  beforeEach(() => localStorage.clear());

  it('getToken / setToken / removeToken / isLoggedIn / logout', () => {
    expect(auth.getToken()).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);

    auth.setToken('abc123');
    expect(localStorage.getItem('token')).toBe('abc123');
    expect(auth.getToken()).toBe('abc123');
    expect(auth.isLoggedIn()).toBe(true);

    auth.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);
  });
});
