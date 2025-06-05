import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import BookEditPage from './pages/BookEditPage';
import AuthorsPage from './pages/AuthorsPage';
import PublishersPage from './pages/PublishersPage';

// Layout
import MainLayout from './components/layout/MainLayout';

const AppRoutes = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    )
  },
  {
    path: '/books',
    element: (
      <MainLayout>
        <BooksPage />
      </MainLayout>
    )
  },
  {
    path: '/books/new',
    element: (
      <MainLayout>
        <BookEditPage />
      </MainLayout>
    )
  },
  {
    path: '/books/:id',
    element: (
      <MainLayout>
        <BookDetailsPage />
      </MainLayout>
    )
  },
  {
    path: '/books/:id/edit',
    element: (
      <MainLayout>
        <BookEditPage />
      </MainLayout>
    )
  },
  {
    path: '/authors',
    element: (
      <MainLayout>
        <AuthorsPage />
      </MainLayout>
    )
  },
  {
    path: '/publishers',
    element: (
      <MainLayout>
        <PublishersPage />
      </MainLayout>
    )
  },
  {
    path: '*',
    element: (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
          <p className="text-gray-600 mt-4">The page you're looking for doesn't exist.</p>
          <a href="/" className="mt-6 inline-block text-primary-purple hover:text-primary-peach">
            Go back to Dashboard
          </a>
        </div>
      </MainLayout>
    )
  }
]);

export default AppRoutes;