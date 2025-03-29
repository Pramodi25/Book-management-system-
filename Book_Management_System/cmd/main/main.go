// main.go
package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"book_management_system/internal/config"
	"book_management_system/internal/db"
	"book_management_system/internal/handler"
	"book_management_system/internal/service"
	"github.com/go-chi/chi/v5"
	_ "github.com/lib/pq"
)

func main() {
	if err := config.Init(); err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	conn, err := sql.Open("postgres", config.GetDBSource())
	if err != nil {
		log.Fatalf("Cannot connect to DB: %v", err)
		return
	}
	defer conn.Close()

	queries := db.New(conn)
	bookService := service.NewBookService(queries)
	bookHandler := handler.NewBookHandler(bookService)
	authorService := service.NewAuthorService(queries)
	authorHandler := handler.NewAuthorHandler(authorService)
	publisherService := service.NewPublisherService(queries)
	publisherHandler := handler.NewPublisherHandler(publisherService)

	r := chi.NewRouter()
	r.Get("/status", handler.StatusHandler(conn))

	r.Route("/books", func(r chi.Router) {
		r.Get("/", bookHandler.GetAll)
		r.Post("/", bookHandler.Create)
		r.Get("/{id}", bookHandler.GetOne)
		r.Put("/{id}", bookHandler.Update)
		r.Delete("/{id}", bookHandler.Delete)
	})

	r.Post("/authors", authorHandler.Create)
	r.Post("/publishers", publisherHandler.Create)

	addr := fmt.Sprintf(":%d", config.AppConfig.Server.Port)
	log.Printf("🚀 Server started at %s", addr)
	log.Fatal(http.ListenAndServe(addr, r))
}
