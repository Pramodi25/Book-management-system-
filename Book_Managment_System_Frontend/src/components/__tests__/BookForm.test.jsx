import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookForm from '../../components/books/BookForm';
import { AppProvider } from '../../contexts/AppContext';

// Mock the hooks
jest.mock('../../hooks/useAuthors', () => ({
  useAuthors: () => ({
    addAuthor: jest.fn(data => Promise.resolve(data)),
    loading: false
  })
}));

jest.mock('../../hooks/usePublishers', () => ({
  usePublishers: () => ({
    addPublisher: jest.fn(data => Promise.resolve(data)),
    loading: false
  })
}));

const mockOnSubmit = jest.fn();

describe('BookForm Component', () => {
  const renderBookForm = (props = {}) => {
    return render(
      <AppProvider>
        <BookForm onSubmit={mockOnSubmit} {...props} />
      </AppProvider>
    );
  };

  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  it('renders the form with all fields', () => {
    renderBookForm();
    
    // Check for presence of form fields
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/author/i)).toBeInTheDocument();
    expect(screen.getByText(/publisher/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publication date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/isbn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pages/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /create book/i })).toBeInTheDocument();
  });

  it('prepopulates fields when initialData is provided', () => {
    const initialData = {
      bookId: '123',
      authorId: 'author1',
      publisherId: 'publisher1',
      title: 'Test Book',
      publicationDate: '2023-01-01',
      isbn: '1234567890',
      pages: 200,
      genre: 'Fiction',
      description: 'A test book',
      price: 19.99,
      quantity: 10
    };
    
    renderBookForm({ initialData });
    
    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Book');
    expect(screen.getByLabelText(/publication date/i)).toHaveValue('2023-01-01');
    expect(screen.getByLabelText(/isbn/i)).toHaveValue('1234567890');
    expect(screen.getByLabelText(/genre/i)).toHaveValue('Fiction');
    expect(screen.getByLabelText(/pages/i)).toHaveValue(200);
    expect(screen.getByLabelText(/price/i)).toHaveValue(19.99);
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(10);
    expect(screen.getByLabelText(/description/i)).toHaveValue('A test book');
    
    // Check for update button text change
    expect(screen.getByRole('button', { name: /update book/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderBookForm();
    
    // Submit form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /create book/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/author is required/i)).toBeInTheDocument();
      expect(screen.getByText(/publisher is required/i)).toBeInTheDocument();
      expect(screen.getByText(/publication date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/isbn is required/i)).toBeInTheDocument();
      expect(screen.getByText(/genre is required/i)).toBeInTheDocument();
    });
    
    // Verify onSubmit wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates fields on blur', async () => {
    renderBookForm();
    
    // Focus and blur the title field without entering value
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.focus(titleInput);
    fireEvent.blur(titleInput);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    
    // Enter invalid value for ISBN
    const isbnInput = screen.getByLabelText(/isbn/i);
    fireEvent.change(isbnInput, { target: { value: 'invalid-isbn' } });
    fireEvent.blur(isbnInput);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/valid isbn/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    renderBookForm();
    
    // Fill out form with valid data
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Book Title' } });
    
    // We would mock select inputs for author and publisher here
    // In a real test, you might need to mock these dropdowns or use mocked data
    
    fireEvent.change(screen.getByLabelText(/publication date/i), { target: { value: '2023-05-17' } });
    fireEvent.change(screen.getByLabelText(/isbn/i), { target: { value: '9780306406157' } });
    fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'Fiction' } });
    fireEvent.change(screen.getByLabelText(/pages/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '29.99' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'A great new book' } });
    
    // Mock successful form submission
    mockOnSubmit.mockResolvedValueOnce(true);
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create book/i }));
    
    // This would be more complete in a real test with more specific assertions
    // about the form data being passed, but for this example we're showing the structure
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
