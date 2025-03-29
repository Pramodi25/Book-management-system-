package handler

import (
	"book_management_system/internal/model"
	"book_management_system/internal/service_interface"
	"encoding/json"
	"net/http"
)

type PublisherHandler struct {
	svc service_interface.PublisherService
}

func NewPublisherHandler(svc service_interface.PublisherService) *PublisherHandler {
	return &PublisherHandler{svc: svc}
}

func (h *PublisherHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.BookRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if err := validate.Struct(req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.svc.CreatePublisher(r.Context(), req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Error creating publisher: "+err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, res)
}
