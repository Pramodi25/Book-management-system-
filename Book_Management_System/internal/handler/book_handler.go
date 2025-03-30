package handler

import (
	"book_management_system/internal/model"
	"book_management_system/internal/service_interface"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

var validate = validator.New()

type BookHandler struct {
	svc service_interface.BookService
}

func NewBookHandler(svc service_interface.BookService) *BookHandler {
	return &BookHandler{svc: svc}
}

func (h *BookHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.BookRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if err := validate.Struct(req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.svc.CreateBook(r.Context(), req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Error creating book: "+err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, res)
}

func (h *BookHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid book ID format")
		return
	}

	if err := h.svc.DeleteBook(r.Context(), id); err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to delete book: "+err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *BookHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	var limit *int32
	var offset *int32

	// Optional limit
	if limitStr := query.Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			val := int32(l)
			limit = &val
		} else {
			writeError(w, http.StatusBadRequest, "Invalid 'limit' parameter")
			return
		}
	}

	// Optional page
	if pageStr := query.Get("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			if limit == nil {
				writeError(w, http.StatusBadRequest, "'limit' must be set if 'page' is provided")
				return
			}
			offset = limit
		} else {
			writeError(w, http.StatusBadRequest, "Invalid 'page' parameter")
			return
		}
	}

	res, err := h.svc.GetAllBooks(r.Context(), limit, offset)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to fetch books: "+err.Error())
		return
	}

	writeJSON(w, http.StatusOK, res)
}

func (h *BookHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid book ID format")
		return
	}

	res, err := h.svc.GetBookByID(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, "Book not found")
		return
	}

	writeJSON(w, http.StatusOK, res)
}

func (h *BookHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid book ID format")
		return
	}

	var req model.BookRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if err := validate.Struct(req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.svc.UpdateBook(r.Context(), id, req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to update book: "+err.Error())
		return
	}

	writeJSON(w, http.StatusOK, res)
}

func (h *BookHandler) Search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	keyword := q.Get("q")

	if keyword == "" {
		writeError(w, http.StatusBadRequest, "Query parameter 'q' is required")
		return
	}

	var limit *int32
	var page *int32

	// Parse limit
	if limitStr := q.Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			val := int32(l)
			limit = &val
		} else {
			writeError(w, http.StatusBadRequest, "Invalid 'limit' parameter")
			return
		}
	}

	// Parse page
	if pageStr := q.Get("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			if limit == nil {
				writeError(w, http.StatusBadRequest, "'limit' must be set if 'page' is provided")
				return
			}
			val := int32(p)
			page = &val
		} else {
			writeError(w, http.StatusBadRequest, "Invalid 'page' parameter")
			return
		}
	}

	res, err := h.svc.SearchBooks(r.Context(), keyword, page, limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Search failed: "+err.Error())
		return
	}

	writeJSON(w, http.StatusOK, res)
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
