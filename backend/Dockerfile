# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
# This command downloads and caches all Go module dependencies specified in go.mod
# If this fails, check that go.mod and go.sum are valid and all repositories are accessible
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .
# Copy the data directory
COPY --from=builder /app/data ./data

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["./main"] 