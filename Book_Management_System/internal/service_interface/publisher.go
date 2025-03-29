package service_interface

import (
	"book_management_system/internal/model"
	"context"
)

type PublisherService interface {
	CreatePublisher(ctx context.Context, req model.PublisherRequest) (*model.PublisherResponse, error)
}
