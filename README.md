# Cloudflare Nameserver Generator API

A FastAPI backend with MongoDB and Cloudflare integration for managing domain nameservers.

## Features

- JWT-based authentication with OAuth2 password flow
- Cloudflare API integration for domain registration and nameserver management
- MongoDB for data storage
- Celery with Redis for background task processing
- Docker and Docker Compose for easy deployment
- Rate limiting to prevent API abuse
- CORS support for frontend integration

## Tech Stack

- **FastAPI**: High-performance Python API framework
- **MongoDB**: NoSQL database for storing user domains and nameservers
- **Cloudflare API**: For domain registration and nameserver generation
- **JWT Authentication**: OAuth2 password flow for secure authentication
- **Celery & Redis**: For background task processing
- **Docker**: For containerization and easy deployment
- **Nginx**: As a reverse proxy

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Cloudflare account with API key

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your configuration values
3. Build and start the containers:

```bash
docker-compose up -d
```

4. The API will be available at http://localhost:8000
5. API documentation is available at http://localhost:8000/docs

## API Endpoints

### Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login and get JWT token

### Nameservers

- `POST /nameservers/create`: Register a domain with Cloudflare and get nameservers
- `GET /nameservers/{domain}`: Get nameservers for a domain
- `DELETE /nameservers/{domain}`: Delete a domain from Cloudflare
- `GET /nameservers/`: List all domains registered by the current user

### Tasks

- `GET /tasks/status/{task_id}`: Check the status of an async task

## Deployment

### AWS EC2 Deployment

1. Launch an EC2 instance with Ubuntu
2. Install Docker and Docker Compose
3. Clone the repository and configure the `.env` file
4. Start the application:

```bash
docker-compose up -d
```

5. Configure Nginx as a reverse proxy
6. Set up SSL using Certbot and Cloudflare

## Security

- JWT authentication for API endpoints
- Rate limiting to prevent abuse
- CORS configuration for frontend integration
- Environment variables for sensitive information

## License

This project is licensed under the MIT License - see the LICENSE file for details.