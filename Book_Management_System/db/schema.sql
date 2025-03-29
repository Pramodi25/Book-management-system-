-- Author Table
CREATE TABLE authors (
                         author_id UUID PRIMARY KEY,
                         name TEXT NOT NULL,
                         bio TEXT
);

-- Publisher Table
CREATE TABLE publishers (
                            publisher_id UUID PRIMARY KEY,
                            name TEXT NOT NULL,
                            address TEXT
);

-- Book Table
CREATE TABLE books (
                       book_id UUID PRIMARY KEY,
                       author_id UUID REFERENCES authors(author_id) ON DELETE CASCADE NOT NULL,
                       publisher_id UUID REFERENCES publishers(publisher_id) ON DELETE CASCADE NOT NULL,
                       title TEXT NOT NULL,
                       publication_date DATE,
                       isbn TEXT,
                       pages INTEGER,
                       genre TEXT,
                       description TEXT,
                       price NUMERIC(10, 2),
                       quantity INTEGER
);
