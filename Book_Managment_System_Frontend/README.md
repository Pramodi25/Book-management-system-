# 📚 Book Management System Frontend

A modern React frontend application for the Book Management System, designed to work with the Go backend API.

## 🚀 Features

- View all books with pagination support
- Search books by title or description
- View detailed information about each book
- Add new books to the system
- Update existing book details
- Delete books from the system
- Create new authors and publishers
- Dashboard with statistics and quick actions

## 🛠️ Tech Stack

- **React 18** - Frontend UI library
- **React Router 6** - For routing
- **Axios** - For API requests
- **TailwindCSS** - For styling
- **Vite** - Build tool
- **UUID** - For generating unique IDs

## 🏗️ Project Structure

```
book-management-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/                  # API service layer
│   │   ├── index.js
│   │   ├── authorsApi.js
│   │   ├── booksApi.js
│   │   └── publishersApi.js
│   ├── components/           # Reusable components
│   │   ├── common/
│   │   ├── layout/
│   │   ├── books/
│   │   ├── authors/
│   │   └── publishers/
│   ├── hooks/                # Custom React hooks
│   │   ├── useBooks.js
│   │   ├── useAuthors.js
│   │   └── usePublishers.js
│   ├── pages/                # Page components
│   │   ├── Dashboard.jsx
│   │   ├── BooksPage.jsx
│   │   └── ...
│   ├── styles/               # Global styles
│   │   └── global.css
│   ├── App.jsx              # Main app component
│   ├── index.jsx            # Entry point
│   └── routes.jsx           # Routes configuration
├── .env.development         # Development environment variables
├── .env.production          # Production environment variables
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## ⚙️ Environment Configuration

The application uses environment variables for configuration:

- `VITE_API_URL`: The base URL for API requests
  - Development: `http://localhost:8080`
  - Production: `/api` (relies on proxy configuration)

## 📋 Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Go backend API running (typically on port 8080)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-management-frontend.git
   cd book-management-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🌐 API Integration

This frontend is designed to work with the Book Management System backend API. Make sure the API is running and accessible at the URL specified in your environment variables.

The API endpoints used by this frontend are:

### Books
- `GET /books` - Get all books (with pagination)
- `GET /books/{id}` - Get a book by ID
- `POST /books` - Create a new book
- `PUT /books/{id}` - Update a book
- `DELETE /books/{id}` - Delete a book
- `GET /books/search?q={query}` - Search books by title/description

### Authors
- `POST /authors` - Create a new author

### Publishers
- `POST /publishers` - Create a new publisher

## 🔐 Development Guidelines

1. **Components**: Use the component structure provided, separating UI from business logic.
2. **API Calls**: All API calls should go through the API service layer.
3. **State Management**: Use React hooks for state management.
4. **Error Handling**: Implement proper error handling at all levels.
5. **Responsive Design**: Ensure all UI components work well on both desktop and mobile.

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🚀 Deployment

1. Build the production version:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist` folder, which can be deployed to any static hosting service.

3. For integration with the backend, configure your server to serve the frontend static files and proxy API requests appropriately.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request