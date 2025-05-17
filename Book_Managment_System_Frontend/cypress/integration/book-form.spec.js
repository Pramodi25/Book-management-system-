describe('Book Form', () => {
  beforeEach(() => {
    // Intercept API calls for authors and publishers
    cy.intercept('GET', '/api/authors', {
      statusCode: 200,
      body: [
        { authorId: '1', name: 'F. Scott Fitzgerald' },
        { authorId: '2', name: 'Harper Lee' }
      ]
    }).as('getAuthors');

    cy.intercept('GET', '/api/publishers', {
      statusCode: 200,
      body: [
        { publisherId: '1', name: 'Scribner' },
        { publisherId: '2', name: 'J.B. Lippincott & Co.' }
      ]
    }).as('getPublishers');

    // Visit the new book page
    cy.visit('/books/new');
  });

  it('validates required fields', () => {
    // Submit the form without filling any fields
    cy.contains('Create Book').click();

    // Check validation messages
    cy.contains('Title is required');
    cy.contains('Author is required');
    cy.contains('Publisher is required');
    cy.contains('Publication date is required');
    cy.contains('ISBN is required');
    cy.contains('Genre is required');
  });

  it('successfully creates a new book', () => {
    // Intercept the POST request to create a book
    cy.intercept('POST', '/api/books', {
      statusCode: 201,
      body: {
        bookId: '3',
        title: 'New Test Book',
        authorId: '1',
        publisherId: '1',
        publicationDate: '2023-05-17',
        isbn: '9780306406157',
        genre: 'Fiction',
        pages: 300,
        price: 19.99,
        quantity: 100,
        description: 'A test book description'
      }
    }).as('createBook');

    // Fill out the form
    cy.get('input[name="title"]').type('New Test Book');
    
    // Select author and publisher (might need adjustment based on your Select component)
    cy.get('select[name="authorId"]').select('1');
    cy.get('select[name="publisherId"]').select('1');
    
    cy.get('input[name="publicationDate"]').type('2023-05-17');
    cy.get('input[name="isbn"]').type('9780306406157');
    cy.get('input[name="genre"]').type('Fiction');
    cy.get('input[name="pages"]').type('300');
    cy.get('input[name="price"]').type('19.99');
    cy.get('input[name="quantity"]').type('100');
    cy.get('textarea[name="description"]').type('A test book description');

    // Submit the form
    cy.contains('Create Book').click();

    // Wait for the API call
    cy.wait('@createBook');

    // Should be redirected to books page or show success message
    cy.contains('Book created successfully');
  });

  it('allows creating a new author', () => {
    // Intercept the POST request to create an author
    cy.intercept('POST', '/api/authors', {
      statusCode: 201,
      body: {
        authorId: '3',
        name: 'New Author',
        bio: 'Author bio'
      }
    }).as('createAuthor');

    // Click the "Add New Author" button
    cy.contains('Add New Author').click();

    // Fill out the author form
    cy.get('input[name="name"]').type('New Author');
    cy.get('textarea').eq(0).type('Author bio');

    // Submit the author form
    cy.contains('button', 'Add').click();

    // Wait for the API call
    cy.wait('@createAuthor');

    // New author should be selected
    cy.get('select[name="authorId"]').should('contain', 'New Author');
  });

  it('shows validation errors for invalid input', () => {
    // Fill out the form with invalid data
    cy.get('input[name="title"]').type('A');
    cy.get('input[name="isbn"]').type('invalid-isbn');
    cy.get('input[name="pages"]').type('-1');
    cy.get('input[name="price"]').type('abc');

    // Move focus to trigger validation
    cy.get('input[name="title"]').blur();
    cy.get('input[name="isbn"]').blur();
    cy.get('input[name="pages"]').blur();
    cy.get('input[name="price"]').blur();

    // Check validation messages
    cy.contains('Title must be at least 3 characters');
    cy.contains('Must be a valid ISBN');
    cy.contains('Pages must be a positive whole number');
    cy.contains('Must be a valid number');

    // Submit button should be disabled or form submission should fail
    cy.contains('Create Book').click();
    cy.url().should('include', '/books/new'); // Should still be on the same page
  });
});
