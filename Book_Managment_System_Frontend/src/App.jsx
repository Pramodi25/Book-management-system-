import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard';
import BookList from './components/Books/BookList';
import BookDetail from './components/Books/BookDetail';
import BookForm from './components/Books/BookForm';
import AuthorForm from './components/Authors/AuthorForm';
import PublisherForm from './components/Publishers/PublisherForm';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/books/new" element={<BookForm />} />
            <Route path="/books/edit/:id" element={<BookForm />} />
            <Route path="/authors/new" element={<AuthorForm />} />
            <Route path="/publishers/new" element={<PublisherForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;