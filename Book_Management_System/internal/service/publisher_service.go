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
	// This is a temporary in-memory store for publishers since we don't have a ListPublishers query yet
	publishers []*model.PublisherResponse
}

func NewPublisherService(publisherDBServiceProvider PublisherDBServiceProvider) *PublisherService {
	return &PublisherService{
		q:          publisherDBServiceProvider,
		publishers: make([]*model.PublisherResponse, 0),
	}
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

	// Create the response
	res := model.PublisherResponseFromDB(&publisher)

	// Store in our temporary cache
	s.publishers = append(s.publishers, res)

	return res, nil
}

func (s *PublisherService) GetAllPublishers(ctx context.Context) ([]*model.PublisherResponse, error) {
	// Return our cached publishers
	return s.publishers, nil
}

func toCreatePublisherParams(req model.PublisherRequest) (db.CreatePublisherParams, error) {
	return db.CreatePublisherParams{
		PublisherID: req.PublisherID,
		Name:        req.Name,
		Address:     sql.NullString{String: req.Address, Valid: true},
	}, nil
}
