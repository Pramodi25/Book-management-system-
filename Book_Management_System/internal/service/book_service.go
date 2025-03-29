package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"book_management_system/internal/db"
	"book_management_system/internal/model"
	"github.com/google/uuid"
)

type BookDBServiceProvider interface {
	CreateBook(ctx context.Context, arg db.CreateBookParams) (db.Book, error)
	DeleteBook(ctx context.Context, bookID uuid.UUID) error
	GetAllBooks(ctx context.Context) ([]db.Book, error)
	GetBookByID(ctx context.Context, bookID uuid.UUID) (db.Book, error)
	UpdateBook(ctx context.Context, arg db.UpdateBookParams) (db.Book, error)
	GetAuthorByID(ctx context.Context, authorID uuid.UUID) (db.Author, error)
	GetPublisherByID(ctx context.Context, publisherID uuid.UUID) (db.Publisher, error)
	SearchBooks(ctx context.Context, keyword sql.NullString) ([]db.Book, error)
}

type BookService struct {
	q BookDBServiceProvider
}

func NewBookService(bookDBServiceProvider BookDBServiceProvider) *BookService {
	return &BookService{
		q: bookDBServiceProvider,
	}
}

func (s *BookService) CreateBook(ctx context.Context, req model.BookRequest) (*model.BookResponse, error) {
	params, err := toCreateBookParams(req)
	if err != nil {
		return nil, err
	}

	_, err = s.q.GetAuthorByID(ctx, params.AuthorID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("not valid Author ID")
		}
		return nil, err
	}

	_, err = s.q.GetPublisherByID(ctx, params.PublisherID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("not valid Publisher ID")
		}
		return nil, err
	}

	book, err := s.q.CreateBook(ctx, params)
	if err != nil {
		return nil, err
	}
	bookResponse := model.BookResponseFromDB(book)
	return &bookResponse, nil
}

func (s *BookService) GetAllBooks(ctx context.Context) ([]*model.BookResponse, error) {
	books, err := s.q.GetAllBooks(ctx)
	if err != nil {
		return nil, err
	}
	res := []*model.BookResponse{}
	for _, b := range books {
		bookResponse := model.BookResponseFromDB(b)
		res = append(res, &bookResponse)
	}
	return res, nil
}

func (s *BookService) GetBookByID(ctx context.Context, id uuid.UUID) (*model.BookResponse, error) {
	b, err := s.q.GetBookByID(ctx, id)
	if err != nil {
		return nil, err
	}
	bookResponse := model.BookResponseFromDB(b)
	return &bookResponse, nil
}

func (s *BookService) UpdateBook(ctx context.Context, id uuid.UUID, req model.BookRequest) (*model.BookResponse, error) {
	params, err := toUpdateBookParams(id, req)
	if err != nil {
		return nil, err
	}

	_, err = s.q.GetAuthorByID(ctx, params.AuthorID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("not valid Author ID")
		}
		return nil, err
	}

	_, err = s.q.GetPublisherByID(ctx, params.PublisherID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("not valid Publisher ID")
		}
		return nil, err
	}

	book, err := s.q.UpdateBook(ctx, params)
	if err != nil {
		return nil, err
	}

	bookResponse := model.BookResponseFromDB(book)
	return &bookResponse, nil
}

func (s *BookService) SearchBooks(ctx context.Context, keyword string) ([]*model.BookResponse, error) {
	if keyword == "" {
		return nil, fmt.Errorf("keyword cannot be empty")
	}

	keywordParam := sql.NullString{
		String: keyword,
		Valid:  true,
	}

	books, err := s.q.SearchBooks(ctx, keywordParam)
	if err != nil {
		return nil, err
	}

	var result []*model.BookResponse
	for _, b := range books {
		book := model.BookResponseFromDB(b)
		result = append(result, &book)
	}
	return result, nil
}

func (s *BookService) DeleteBook(ctx context.Context, id uuid.UUID) error {
	return s.q.DeleteBook(ctx, id)
}

func toCreateBookParams(req model.BookRequest) (db.CreateBookParams, error) {
	pubDate, err := time.Parse("2006-01-02", req.PublicationDate)
	if err != nil {
		return db.CreateBookParams{}, fmt.Errorf("invalid publication date format: %w", err)
	}

	return db.CreateBookParams{
		BookID:          req.BookID,
		AuthorID:        req.AuthorID,
		PublisherID:     req.PublisherID,
		Title:           req.Title,
		PublicationDate: sql.NullTime{Time: pubDate, Valid: true},
		Isbn:            sql.NullString{String: req.ISBN, Valid: req.ISBN != ""},
		Pages:           sql.NullInt32{Int32: req.Pages, Valid: req.Pages > 0},
		Genre:           sql.NullString{String: req.Genre, Valid: req.Genre != ""},
		Description:     sql.NullString{String: req.Description, Valid: req.Description != ""},
		Price:           sql.NullString{String: fmt.Sprintf("%.2f", req.Price), Valid: true},
		Quantity:        sql.NullInt32{Int32: req.Quantity, Valid: true},
	}, nil
}

func toUpdateBookParams(id uuid.UUID, req model.BookRequest) (db.UpdateBookParams, error) {
	createParams, err := toCreateBookParams(req)
	if err != nil {
		return db.UpdateBookParams{}, err
	}

	return db.UpdateBookParams{
		BookID:          id,
		AuthorID:        createParams.AuthorID,
		PublisherID:     createParams.PublisherID,
		Title:           createParams.Title,
		PublicationDate: createParams.PublicationDate,
		Isbn:            createParams.Isbn,
		Pages:           createParams.Pages,
		Genre:           createParams.Genre,
		Description:     createParams.Description,
		Price:           createParams.Price,
		Quantity:        createParams.Quantity,
	}, nil
}
