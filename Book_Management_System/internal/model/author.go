package model

import (
	"book_management_system/internal/db"
	"github.com/google/uuid"
)

type AuthorRequest struct {
	AuthorID uuid.UUID `json:"authorId" validate:"required"`
	Name     string    `json:"name" validate:"required"`
	Bio      string    `json:"biography" validate:"required"`
}

type AuthorResponse struct {
	AuthorID uuid.UUID `json:"authorId"`
	Name     string    `json:"name"`
	Bio      string    `json:"biography"`
}

func AuthorResponseFromDB(Author *db.Author) *AuthorResponse {
	return &AuthorResponse{
		AuthorID: Author.AuthorID,
		Name:     Author.Name,
		Bio:      Author.Bio.String,
	}
}
