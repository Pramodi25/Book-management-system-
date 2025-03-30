# 📚 Book Management System

A RESTful API built with **Go** and **PostgreSQL** for managing a collection of books. This system supports creating, reading, updating, deleting, and searching for books.

## 🚀 Features

- Add new books to the system
- Retrieve all books or specific books by ID
- Update book details
- Delete books from the system
- Search books by title or description (case-insensitive)

## 🛠️ Tech Stack

- **Go (Golang)** – Backend API
- **PostgreSQL** – Relational database
- **Chi Router** – Lightweight HTTP router
- **sqlc** – Generate Go code from SQL queries
- **go-playground/validator** – Input validation

## 📂 Project Structure

Book_Management_System/ │ ├── api/ │ └── openapi.yaml │ ├── cmd/ │ └── main/ │ └── main.go │ ├── db/ │ ├── queries.sql │ ├── schema.sql │ ├── db.go │ ├── models.go │ └── queries.sql.go │ ├── init/ │ └── init.sql │ ├── internal/ │ └── config/ │ └── config.go │ ├── handler/ │ ├── author_handler.go │ ├── book_handler.go │ ├── publisher_handler.go │ └── status_handler.go │ ├── model/ │ ├── author.go │ ├── book.go │ └── publisher.go │ ├── service/ │ ├── author_service.go │ ├── book_service.go │ └── publisher_service.go │ ├── service_interface/ │ ├── author.go │ ├── book.go │ └── publisher.go │ ├── .gitignore ├── config.yaml ├── config.docker.yaml ├── docker-compose.yml ├── Dockerfile ├── go.mod ├── sqlc.yaml └── README.md

## 🛠️ How to Run Locally

You can run the project in two ways: **using Docker** 


### 📦 Option 1: Run with Docker

> Make sure you have Docker and Docker Compose installed.

1. **Navigate to the project directory.**

2. **Update environment variables** if needed in:
    - `config.docker.yaml`
    - `sqlc.yaml`

3. **Run with Docker Compose:**

```bash
docker compose down --volumes
docker-compose up --build
```

## 📬 API Endpoints

### ✅ Status

| Method | Endpoint     | Description                 |
|--------|--------------|-----------------------------|
| GET    | `/status`    | Check database connection   |

---

### 📚 Books

| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| GET    | `/books`           | Get all books                      |
| GET    | `/books/{id}`      | Get a book by ID                   |
| POST   | `/books`           | Create a new book                  |
| PUT    | `/books/{id}`      | Update an existing book by ID      |
| DELETE | `/books/{id}`      | Delete a book by ID                |
| GET    | `/books/search?q=` | Search books by title/description  |

---

### 👨‍💼 Authors

| Method | Endpoint     | Description           |
|--------|--------------|-----------------------|
| POST   | `/authors`   | Create a new author   |

---

### 🏢 Publishers

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | `/publishers`   | Create a new publisher   |



## 🙌 Acknowledgements

Special thanks to the open-source Go community and contributors of libraries like `chi`, `sqlc`, and `go-playground/validator` for making development seamless and efficient.

---

## ✨ Contact

Built by Pramodi Silva

- GitHub: [@Pramodi25](https://github.com/Pramodi25)
- Email: pramosilva25@gmail.com
