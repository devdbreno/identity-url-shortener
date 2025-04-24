# URL Shortener Monorepo with NestJS & Clean Architecture

## Overview

Este monorepo contém dois serviços NestJS:

- **identity-service**: registro e login de usuários com JWT.
- **url-service**: criação e gestão de URLs encurtadas, contabilização de cliques.

Arquitetura em camadas (Clean Architecture):

- Domain
- Application (Use Cases)
- Infrastructure (TypeORM, DB)
- Presentation (Controllers, DTOs)

## Rodando Localmente

1. Clone o repositório.
2. Copie `.env.example` para `.env`.
3. Execute:
   ```bash
   docker-compose up --build
   ```
4. Acesse:
   - Identity: http://localhost:4000
   - URL: http://localhost:4001
