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

## 📬 Postman Collection

You can find the Postman collection for the APIs of this project at the following link:

[Postman Collection](https://cloudy-meadow-983638.postman.co/workspace/Team-Workspace~72e47a74-9b28-413d-8c77-bc2424abcdcc/collection/9680139-4278aed1-0f36-4cbe-bf0b-9281234fe11d?action=share&creator=9680139&active-environment=9680139-cdf992de-67f5-418a-a12d-558a94c6a2d1)

---

## 🚀 Future Improvements

Here are some potential improvements to enhance the project:

1. **Test Coverage**:

   - Increase test coverage for the `short-url-service` to ensure reliability and robustness.

2. **Metrics System**:

   - Implement a metrics system (e.g., Prometheus, Grafana) to monitor service performance and usage.

3. **Logging and Tracing**:

   - Introduce structured logging and distributed tracing (e.g., using tools like Elasticsearch, Kibana, and OpenTelemetry) to improve debugging and observability.

4. **Code Quality Enhancements**:
   - Analyze and apply design patterns or refactoring techniques to improve code quality and maintainability.
   - Perform regular code reviews to ensure adherence to clean architecture principles.

These improvements will help make the project more scalable, maintainable, and production-ready.
