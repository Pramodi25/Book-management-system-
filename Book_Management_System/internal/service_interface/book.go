package service_interface

import (
	"book_management_system/internal/model"
	"context"
	"github.com/google/uuid"
)

type BookService interface {
	CreateBook(ctx context.Context, req model.BookRequest) (*model.BookResponse, error)
	GetAllBooks(ctx context.Context, page *int32, limit *int32) (*model.GetBooksResponse, error)
	GetBookByID(ctx context.Context, id uuid.UUID) (*model.BookResponse, error)
	UpdateBook(ctx context.Context, id uuid.UUID, req model.BookRequest) (*model.BookResponse, error)
	DeleteBook(ctx context.Context, id uuid.UUID) error
	SearchBooks(ctx context.Context, keyword string, page *int32, limit *int32) (*model.GetBooksResponse, error)
}
