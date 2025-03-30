FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/server ./cmd/main/main.go

# Final lightweight image
FROM alpine:latest

WORKDIR /app

# Copy binary and config file
COPY --from=builder /app/server /app/
COPY config.docker.yaml /app/config.yaml

RUN chmod +x /app/server

EXPOSE 8080

CMD ["/app/server"]
