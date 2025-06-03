package service_interface

import (
	"book_management_system/internal/model"
	"context"
)

type AuthorService interface {
	CreateAuthor(ctx context.Context, req model.AuthorRequest) (*model.AuthorResponse, error)
	GetAllAuthors(ctx context.Context) ([]*model.AuthorResponse, error)
}
