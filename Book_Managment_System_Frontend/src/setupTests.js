// Add Jest setup and configuration
import '@testing-library/jest-dom';

// Mock global fetch for API tests
global.fetch = jest.fn();

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
