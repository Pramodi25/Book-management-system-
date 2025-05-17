package main

import (
	"book_management_system/internal/config"
	"book_management_system/internal/db"
	"book_management_system/internal/handler"
	"book_management_system/internal/service"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	_ "github.com/lib/pq"
)

func main() {
	if err := config.Init(); err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	conn, err := sql.Open("postgres", config.GetDBSource())
	if err != nil {
		log.Fatalf("Cannot connect to DB: %v", err)
	}

	// Optional: Wait for DB to be ready (good in Docker Compose setup)
	for i := 0; i < 10; i++ {
		if err := conn.Ping(); err == nil {
			log.Println("Database connection successful")
			break
		}
		log.Println("⏳ Waiting for database to be ready...")
		time.Sleep(2 * time.Second)
	}
	if err := conn.Ping(); err != nil {
		log.Fatalf("Could not establish connection to database: %v", err)
	}

	queries := db.New(conn)
	bookService := service.NewBookService(queries)
	bookHandler := handler.NewBookHandler(bookService)
	authorService := service.NewAuthorService(queries)
	authorHandler := handler.NewAuthorHandler(authorService)
	publisherService := service.NewPublisherService(queries)
	publisherHandler := handler.NewPublisherHandler(publisherService)
	// Router setup
	r := chi.NewRouter()

	// Add CORS middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not eagerly cleared by browsers
	}))

	// Add other middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/status", handler.StatusHandler(conn))

	r.Route("/books", func(r chi.Router) {
		r.Get("/", bookHandler.GetAll)
		r.Post("/", bookHandler.Create)
		r.Get("/{id}", bookHandler.GetOne)
		r.Put("/{id}", bookHandler.Update)
		r.Delete("/{id}", bookHandler.Delete)
		r.Get("/search", bookHandler.Search)
	})

	r.Post("/authors", authorHandler.Create)
	r.Post("/publishers", publisherHandler.Create)

	// Start server
	port := config.AppConfig.Server.Port
	if port == 0 {
		port = 8080 // fallback
	}
	addr := fmt.Sprintf(":%d", port)
	log.Printf("Server started at %s", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
