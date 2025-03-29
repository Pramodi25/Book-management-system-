package model

import (
	"book_management_system/internal/db"
	"github.com/google/uuid"
)

type PublisherRequest struct {
	PublisherID uuid.UUID `json:"publisher_id" validate:"required"`
	Name        string    `json:"name" validate:"required"`
	Address     string    `json:"address" validate:"required"`
}

type PublisherResponse struct {
	PublisherID uuid.UUID `json:"publisher_id"`
	Name        string    `json:"name"`
	Address     string    `json:"address"`
}

func PublisherResponseFromDB(Publisher *db.Publisher) *PublisherResponse {
	return &PublisherResponse{
		PublisherID: Publisher.PublisherID,
		Name:        Publisher.Name,
		Address:     Publisher.Address.String,
	}
}
