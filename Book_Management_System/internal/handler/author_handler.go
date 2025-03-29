package handler

import (
	"book_management_system/internal/model"
	"book_management_system/internal/service_interface"
	"encoding/json"
	"net/http"
)

type AuthorHandler struct {
	svc service_interface.AuthorService
}

func NewAuthorHandler(svc service_interface.PublisherService) *PublisherHandler {
	return &PublisherHandler{svc: svc}
}

func (h *AuthorHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.AuthorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if err := validate.Struct(req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.svc.CreateAuthor(r.Context(), req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Error creating author: "+err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, res)
}
