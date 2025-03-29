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
}

func NewAuthorService(authorDBServiceProvider AuthorDBServiceProvider) *AuthorService {
	return &AuthorService{
		q: authorDBServiceProvider,
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
	return model.AuthorResponseFromDB(&author), nil
}

func toCreateAuthorParams(req model.AuthorRequest) (db.CreateAuthorParams, error) {
	return db.CreateAuthorParams{
		AuthorID: req.AuthorID,
		Name:     req.Name,
		Bio:      sql.NullString{String: req.Bio, Valid: true},
	}, nil
}
