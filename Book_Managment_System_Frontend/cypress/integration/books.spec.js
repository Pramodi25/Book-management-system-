describe('Books Page', () => {
  beforeEach(() => {
    // Intercept API calls and provide mock data
    cy.intercept('GET', '/api/books*', {
      statusCode: 200,
      body: {
        books: [
          {
            bookId: '1',
            title: 'The Great Gatsby',
            author: { name: 'F. Scott Fitzgerald' },
            publisher: { name: 'Scribner' },
            publicationDate: '1925-04-10',
            isbn: '9780743273565',
            genre: 'Classic',
            pages: 180,
            price: 12.99,
            quantity: 50
          },
          {
            bookId: '2',
            title: 'To Kill a Mockingbird',
            author: { name: 'Harper Lee' },
            publisher: { name: 'J.B. Lippincott & Co.' },
            publicationDate: '1960-07-11',
            isbn: '9780060935467',
            genre: 'Fiction',
            pages: 281,
            price: 14.99,
            quantity: 75
          }
        ],
        total: 2,
        page: 1,
        limit: 10
      }
    }).as('getBooks');

    // Visit the books page
    cy.visit('/books');
  });

  it('displays the book list', () => {
    // Wait for the API call to complete
    cy.wait('@getBooks');

    // Check that the books are displayed
    cy.contains('h1', 'Books');
    cy.contains('The Great Gatsby');
    cy.contains('To Kill a Mockingbird');
    
    // Check that book details are displayed
    cy.contains('F. Scott Fitzgerald');
    cy.contains('Harper Lee');
    cy.contains('Classic');
    cy.contains('Fiction');
  });

  it('allows searching for books', () => {
    cy.wait('@getBooks');

    // Set up intercept for search results
    cy.intercept('GET', '/api/books/search*', {
      statusCode: 200,
      body: {
        books: [
          {
            bookId: '1',
            title: 'The Great Gatsby',
            author: { name: 'F. Scott Fitzgerald' },
            publisher: { name: 'Scribner' },
            publicationDate: '1925-04-10',
            isbn: '9780743273565',
            genre: 'Classic',
            pages: 180,
            price: 12.99,
            quantity: 50
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      }
    }).as('searchBooks');

    // Type in the search box
    cy.get('input[placeholder*="Search"]').type('gatsby');
    
    // Submit the search
    cy.get('form').submit();
    
    // Wait for search results
    cy.wait('@searchBooks');
    
    // Check that only The Great Gatsby is displayed
    cy.contains('The Great Gatsby');
    cy.contains('To Kill a Mockingbird').should('not.exist');
  });

  it('allows navigation to book details', () => {
    cy.wait('@getBooks');

    // Set up intercept for book details
    cy.intercept('GET', '/api/books/1', {
      statusCode: 200,
      body: {
        bookId: '1',
        title: 'The Great Gatsby',
        author: { name: 'F. Scott Fitzgerald' },
        publisher: { name: 'Scribner' },
        publicationDate: '1925-04-10',
        isbn: '9780743273565',
        genre: 'Classic',
        pages: 180,
        price: 12.99,
        quantity: 50,
        description: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald.'
      }
    }).as('getBookDetails');

    // Click on the first book
    cy.contains('The Great Gatsby').click();
    
    // Wait for book details to load
    cy.wait('@getBookDetails');
    
    // Check that we're on the details page
    cy.url().should('include', '/books/1');
    cy.contains('The Great Gatsby');
    cy.contains('F. Scott Fitzgerald');
    cy.contains('The Great Gatsby is a 1925 novel');
  });
});
