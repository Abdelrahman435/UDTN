# Node.js Authentication and Product Management API

## Description

This project is a RESTful API built using **NestJS**, **SQLite**, and **TypeORM**. It provides:

1. **Authentication Module**: User authentication with role-based access control.
2. **Product Management Module**: CRUD operations for managing products.

The project includes **Git integration**, **Swagger documentation**, and **unit tests** with at least 80% coverage.

## Setup Instructions

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-link>
   cd <project-directory>

   ## Features
   ```

### Authentication Module

- **Endpoints**:
  - `POST /auth/register`: Register a new user.
  - `POST /auth/login`: Authenticate and receive a JWT token.
- **Features**:
  - Role-based access control (`admin`, `user`).
  - Password encryption using bcrypt.
  - Secure routes using `AuthGuard` and `RolesGuard`.

### Product Management Module

- **Endpoints**:
  - `POST /products`: Create a product (Admin only).
  - `GET /products`: Retrieve all products.
  - `GET /products/:id`: Retrieve a product by ID.
  - `PUT /products/:id`: Update a product's details (Admin only).
  - `DELETE /products/:id`: Delete a product (Admin only).
- **Features**:
  - Input validation with `class-validator`.
  - Database operations with **TypeORM** and **SQLite**.

### run

npm run start:dev

### Swagger

http://localhost:3009/api-docs
