# URL Shortener API Monorepo

## Overview

This monorepo contains two NestJS services:

This repository is a monorepo for a scalable and modular URL Shortener platform, built using **NestJS**, **TypeScript**, and **Docker**. It follows a clean architecture structure and consists of two main microservices: the `identity-service` and the `short-url-service`.

## Layered architecture:

- Domain
- Application (Use Cases)
- Infra (TypeORM, DB)
- Presentation (Controllers, DTOs)

## 🧩 Services Overview

### 🛂 Identity Service

- **Description**: Handles user registration, login, and token validation.
- **Location**: `services/identity-service`
- **Features**:
  - Register, profile and login endpoints
  - JWT-based authentication
  - TCP transport microservice
  - Clean architecture (application, domain, infra, presentation)

### 🔗 Short URL Service

- **Description**: Responsible for URL shortening, redirectio and management.
- **Location**: `services/short-url-service`
- **Features**:
  - Create, update and delete short URLs
  - Redirect to original URL using shortcode
  - Auth integration with the identity service via TCP
  - Validation pipe for shortcode formats

### 📐 Shared Types

- **Location**: `services/types`
- **Purpose**: Contains global type extensions such as `Express` interface customization.

## ⚙️ Getting started

### Prerequisites

- Node.js v20+
- Yarn v4.9.1+ (Berry)
- Docker & Docker Compose

### Setup

1. **Clone the repository**

   ```bash
   |> git clone https://github.com/devdbreno/identity-url-shortener.git

   |> cd identity-url-shortener

   |> cp .env.example .env

   |> yarn install
   ```

## 🧪 Running Tests Units/E2E together

### Example for identity-service

```bash
# Bring up only the docker database containers
|> docker compose down

|> docker compose up postgres-url postgres-identity -d --build

|> cd services/identity-service

|> yarn test
```

### Example for short-url-service

```bash
cd services/short-url-service

yarn test
```

## 📬 Communication between services

This project uses TCP transport layer to communicate between services using NestJS Microservices. For example:

The short-url-service calls identity-service to validate JWT tokens via TCP.

## Running locally with docker

1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Run:

```bash
docker-compose up --build
```

4. Access:

- Identity: http://localhost:4000

- URL Shortener Service: http://localhost:4001

- Both services provide API documentation available at `/api-docs`:
  - Identity Service: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
  - URL Shortener Service: [http://localhost:4001/api-docs](http://localhost:4001/api-docs)
