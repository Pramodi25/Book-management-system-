import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import BookEditPage from './pages/BookEditPage';
import AuthorsPage from './pages/AuthorsPage';
import PublishersPage from './pages/PublishersPage';
import TestPage from './pages/TestPage';

// Layout
import MainLayout from './components/layout/MainLayout';

const AppRoutes = createBrowserRouter([
  {
    path: '/test',
    element: <TestPage />
  },
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
  }
]);

export default AppRoutes;