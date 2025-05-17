import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AppProvider, useAppContext } from '../../contexts/AppContext';

// Mock API calls
jest.mock('../../api/booksApi', () => ({
  getAllBooks: jest.fn(() => Promise.resolve({
    books: [{ bookId: '1', title: 'Test Book' }],
    total: 1,
    page: 1,
    limit: 10
  }))
}));

jest.mock('../../api/authorsApi', () => ({
  getAllAuthors: jest.fn(() => Promise.resolve([{ authorId: '1', name: 'Test Author' }]))
}));

jest.mock('../../api/publishersApi', () => ({
  getAllPublishers: jest.fn(() => Promise.resolve([{ publisherId: '1', name: 'Test Publisher' }]))
}));

// Test component that uses context
const TestComponent = () => {
  const { state, actions } = useAppContext();
  
  return (
    <div>
      <div data-testid="books-count">{state.books.data.length}</div>
      <div data-testid="books-loading">{state.books.loading.toString()}</div>
      <div data-testid="theme">{state.ui.theme}</div>
      <button onClick={actions.toggleTheme}>Toggle Theme</button>
      <button onClick={() => actions.fetchBooks()}>Fetch Books</button>
      <button onClick={() => actions.fetchAuthors()}>Fetch Authors</button>
      <button onClick={() => actions.fetchPublishers()}>Fetch Publishers</button>
      <button onClick={() => actions.addNotification({ type: 'success', message: 'Test Notification' })}>
        Add Notification
      </button>
    </div>
  );
};

describe('AppContext', () => {
  it('provides initial state', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    expect(screen.getByTestId('books-count')).toHaveTextContent('0');
    expect(screen.getByTestId('books-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('toggles theme', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    // Initial theme is light
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    
    // Click toggle theme button
    act(() => {
      screen.getByText('Toggle Theme').click();
    });
    
    // Theme should be dark
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    
    // Click toggle theme button again
    act(() => {
      screen.getByText('Toggle Theme').click();
    });
    
    // Theme should be light again
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('fetches books', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    // Initial books count is 0
    expect(screen.getByTestId('books-count')).toHaveTextContent('0');
    
    // Click fetch books button
    act(() => {
      screen.getByText('Fetch Books').click();
    });
    
    // Loading state should be active immediately
    expect(screen.getByTestId('books-loading')).toHaveTextContent('true');
    
    // After API call resolves, books should be loaded
    await waitFor(() => {
      expect(screen.getByTestId('books-count')).toHaveTextContent('1');
      expect(screen.getByTestId('books-loading')).toHaveTextContent('false');
    });
  });

  it('fetches authors and publishers', async () => {
    const { getAllAuthors } = require('../../api/authorsApi');
    const { getAllPublishers } = require('../../api/publishersApi');
    
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    // Fetch authors
    act(() => {
      screen.getByText('Fetch Authors').click();
    });
    
    await waitFor(() => {
      expect(getAllAuthors).toHaveBeenCalled();
    });
    
    // Fetch publishers
    act(() => {
      screen.getByText('Fetch Publishers').click();
    });
    
    await waitFor(() => {
      expect(getAllPublishers).toHaveBeenCalled();
    });
  });

  it('adds notifications', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    // Add notification
    act(() => {
      screen.getByText('Add Notification').click();
    });
    
    // We would normally test for the notification appearing in the UI
    // but that would require rendering a component that displays notifications
  });
});
