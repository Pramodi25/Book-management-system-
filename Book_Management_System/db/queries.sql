-- BOOKS
-- name: GetAllBooks :many
SELECT * FROM books;

-- name: GetBookByID :one
SELECT * FROM books WHERE book_id = $1;

-- name: CreateBook :one
INSERT INTO books (
    book_id, author_id, publisher_id,
    title, publication_date, isbn,
    pages, genre, description,
    price, quantity
) VALUES (
             $1, $2, $3,
             $4, $5, $6,
             $7, $8, $9,
             $10, $11
         )
    RETURNING *;

-- name: UpdateBook :one
UPDATE books SET
                 author_id = $2,
                 publisher_id = $3,
                 title = $4,
                 publication_date = $5,
                 isbn = $6,
                 pages = $7,
                 genre = $8,
                 description = $9,
                 price = $10,
                 quantity = $11
WHERE book_id = $1
    RETURNING *;

-- name: DeleteBook :exec
DELETE FROM books WHERE book_id = $1;

-- AUTHORS
-- name: CreateAuthor :one
INSERT INTO authors (author_id, name, bio)
VALUES ($1, $2, $3)
    RETURNING *;

-- name: GetAuthorByID :one
SELECT * FROM authors WHERE author_id  = $1;

-- PUBLISHERS
-- name: CreatePublisher :one
INSERT INTO publishers (publisher_id, name, address)
VALUES ($1, $2, $3)
    RETURNING *;

-- name: GetPublisherByID :one
SELECT * FROM publishers WHERE publisher_id = $1;

-- name: SearchBooks :many
SELECT book_id, author_id, publisher_id, title, publication_date, isbn, pages, genre, description, price, quantity
FROM books
WHERE LOWER(title) LIKE LOWER('%' || $1 || '%') OR LOWER(description) LIKE LOWER('%' || $1 || '%');

-- name: GetBooksPaginated :many
SELECT book_id, author_id, publisher_id, title, publication_date, isbn, pages, genre, description, price, quantity
FROM books
ORDER BY title
    LIMIT $1 OFFSET $2;

