# Book Management System Frontend - Testing Guide

This document provides an overview of the testing setup for the Book Management System frontend application.

## Testing Stack

Our testing approach consists of several layers:

1. **Unit Tests** - Using Jest and React Testing Library to test individual components and utilities
2. **Integration Tests** - Testing how components work together using React Testing Library
3. **End-to-End Tests** - Using Cypress to test complete user workflows

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### End-to-End Tests

```bash
# Open Cypress UI for interactive testing
npm run e2e

# Run all Cypress tests headlessly
npm run e2e:run
```

## Test Structure

### Unit Tests

Unit tests are located alongside the files they test in `__tests__` directories:

- `src/utils/__tests__/validators.test.js` - Tests for validation utilities
- `src/contexts/__tests__/AppContext.test.jsx` - Tests for the global state management

### Integration Tests

Integration tests focus on how components interact:

- `src/components/__tests__/BookForm.test.jsx` - Tests for form validation and submission
- More tests to be added for other components

### End-to-End Tests

E2E tests are in the `cypress/integration` directory:

- `books.spec.js` - Tests the book listing and details pages
- `book-form.spec.js` - Tests the book creation and editing workflows

## Test Coverage

We aim for high test coverage, but prioritize critical business logic and user flows:

1. Form validation
2. State management
3. API interactions
4. Critical user workflows

Current test coverage targets:
- Utilities: 90%+
- Components: 70%+
- Overall application: 80%+

## Mocking Strategy

We use different mocking strategies at different levels:

- **Unit Tests**: Mock hooks, context, and API calls
- **Integration Tests**: Mock API calls but use real hooks and context
- **E2E Tests**: Mock backend API responses with Cypress interceptors

## Adding New Tests

When adding new features, follow this approach:

1. Add unit tests for any new utilities or isolated functions
2. Add integration tests for new components
3. Update existing or add new E2E tests for complete workflows

For complex components, consider testing:
- Initial rendering
- User interactions
- Error handling
- Integration with global state

## Continuous Integration

Tests are run automatically on every PR and push to main branch via our CI pipeline.
