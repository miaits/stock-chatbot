# Stock Chatbot

A web application that provides a chatbot interface for interacting with stock market data. The application consists of a Go backend and a React frontend, containerized and deployed on Kubernetes.

## Live Demo

The application is publicly accessible at: https://lseg-chatbot.klusterio.com/

## Project Structure

- `backend/`: Go backend service
- `frontend/`: React frontend application
- `helm/`: Kubernetes deployment configurations

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/miaits/lseg-chatbot.git
cd lseg-chatbot
```

2. Backend Setup:
```bash
cd backend
go mod download
go run main.go
```
The backend will start on http://localhost:8080

3. Frontend Setup:
```bash
cd frontend
yarn install
yarn run dev
```
The frontend will start on http://localhost:5173

### Kubernetes Development Setup

1. Ensure you have access to the Kubernetes cluster and kubectl is configured

2. Deploy the application using Helm:
```bash
cd helm
helm install lseg-chatbot ./lseg-chatbot
```

3. Port-forward the services for local access:
```bash
# Forward backend service
kubectl port-forward svc/lseg-chatbot-backend 8080:8080

# Forward frontend service
kubectl port-forward svc/lseg-chatbot-frontend 3000:3000
```

The services will be accessible at:
- Backend: http://localhost:8080
- Frontend: http://localhost:3000

## Features

- Chatbot interface for querying stock information
- Modern web interface built with React
- Scalable backend service built with Go
- Containerized deployment with Docker
- Kubernetes orchestration for production deployment

## Roadmap


- Enable real-time data by implementing yahoo-finance library
