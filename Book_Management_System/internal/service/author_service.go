package service

import (
	"book_management_system/internal/db"
	"book_management_system/internal/model"
	"context"
	"database/sql"
)

type AuthorDBServiceProvider interface {
	CreateAuthor(ctx context.Context, arg db.CreateAuthorParams) (db.Author, error)
}

type AuthorService struct {
	q AuthorDBServiceProvider
	// This is a temporary in-memory store for authors since we don't have a ListAuthors query yet
	authors []*model.AuthorResponse
}

func NewAuthorService(authorDBServiceProvider AuthorDBServiceProvider) *AuthorService {
	return &AuthorService{
		q:       authorDBServiceProvider,
		authors: make([]*model.AuthorResponse, 0),
	}
}

func (s *AuthorService) CreateAuthor(ctx context.Context, req model.AuthorRequest) (*model.AuthorResponse, error) {
	dbReq, err := toCreateAuthorParams(req)
	if err != nil {
		return nil, err
	}
	author, err := s.q.CreateAuthor(ctx, dbReq)
	if err != nil {
		return nil, err
	}

	// Create the response
	res := model.AuthorResponseFromDB(&author)

	// Store in our temporary cache
	s.authors = append(s.authors, res)

	return res, nil
}

func (s *AuthorService) GetAllAuthors(ctx context.Context) ([]*model.AuthorResponse, error) {
	// Return our cached authors
	return s.authors, nil
}

func toCreateAuthorParams(req model.AuthorRequest) (db.CreateAuthorParams, error) {
	return db.CreateAuthorParams{
		AuthorID: req.AuthorID,
		Name:     req.Name,
		Bio:      sql.NullString{String: req.Bio, Valid: true},
	}, nil
}
