package service

import (
	"book_management_system/internal/db"
	"book_management_system/internal/model"
	"context"
	"database/sql"
)

type PublisherDBServiceProvider interface {
	CreatePublisher(ctx context.Context, arg db.CreatePublisherParams) (db.Publisher, error)
}

type PublisherService struct {
	q PublisherDBServiceProvider
}

func (s *PublisherService) CreatePublisher(ctx context.Context, req model.PublisherRequest) (*model.PublisherResponse, error) {
	dbReq, err := toCreatePublisherParams(req)
	if err != nil {
		return nil, err
	}
	publisher, err := s.q.CreatePublisher(ctx, dbReq)
	if err != nil {
		return nil, err
	}
	return model.PublisherResponseFromDB(&publisher), nil
}

func toCreatePublisherParams(req model.PublisherRequest) (db.CreatePublisherParams, error) {
	return db.CreatePublisherParams{
		PublisherID: req.PublisherID,
		Name:        req.Name,
		Address:     sql.NullString{String: req.Address, Valid: true},
	}, nil
}
