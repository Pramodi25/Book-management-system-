package model

import (
	"book_management_system/internal/db"
	"github.com/google/uuid"
	"strconv"
)

type BookRequest struct {
	BookID          uuid.UUID `json:"bookId" validate:"required"`
	AuthorID        uuid.UUID `json:"authorId" validate:"required"`
	PublisherID     uuid.UUID `json:"publisherId" validate:"required"`
	Title           string    `json:"title" validate:"required"`
	PublicationDate string    `json:"publicationDate" validate:"required,datetime=2006-01-02"`
	ISBN            string    `json:"isbn" validate:"required"`
	Pages           int32     `json:"pages" validate:"required,gte=1"`
	Genre           string    `json:"genre" validate:"required"`
	Description     string    `json:"description"`
	Price           float64   `json:"price" validate:"required,gte=0"`
	Quantity        int32     `json:"quantity" validate:"gte=0"`
}

type GetBooksResponse struct {
	Total      *int32          `json:"total,omitempty"`
	PageNumber *int32          `json:"pageNumber,omitempty"`
	PageSize   *int32          `json:"pageSize,omitempty"`
	Books      []*BookResponse `json:"books"`
}

type BookResponse struct {
	BookID          uuid.UUID `json:"bookId"`
	AuthorID        uuid.UUID `json:"authorId"`
	PublisherID     uuid.UUID `json:"publisherId"`
	Title           string    `json:"title"`
	PublicationDate string    `json:"publicationDate"`
	ISBN            string    `json:"isbn"`
	Pages           int32     `json:"pages"`
	Genre           string    `json:"genre"`
	Description     string    `json:"description"`
	Price           float64   `json:"price"`
	Quantity        int32     `json:"quantity"`
}

func BookResponseFromDB(book db.Book) BookResponse {
	return BookResponse{
		BookID:          book.BookID,
		AuthorID:        book.AuthorID,
		PublisherID:     book.PublisherID,
		Title:           book.Title,
		PublicationDate: book.PublicationDate.Time.Format("2006-01-02"), // Check for .Valid if needed
		ISBN:            book.Isbn.String,
		Pages:           int32(book.Pages.Int32),
		Genre:           book.Genre.String,
		Description:     book.Description.String,
		Price:           parsePrice(book.Price.String),
		Quantity:        int32(book.Quantity.Int32),
	}
}

func parsePrice(priceStr string) float64 {
	// Fallback parser if DB stores price as string
	p, _ := strconv.ParseFloat(priceStr, 64)
	return p
}
