# StoreRate

A full-stack store rating platform where users can discover stores, submit ratings, and manage their ratings. Administrators can manage users and stores, while store owners can monitor ratings for their stores.

## Overview

StoreRate is a role-based web application built with a NestJS backend, React frontend, and PostgreSQL database.

The application provides three different roles:

- **ADMIN** — manages users, stores, and platform statistics.
- **USER** — searches stores and submits or updates ratings.
- **STORE_OWNER** — views store information, ratings, and average ratings.

Authentication is implemented using JWT, with role-based route protection and server-side validation.
---

## Screenshots

### User Dashboard

Users can search stores, view overall ratings, see their own ratings, and submit or update ratings using the 1–5 star interface.

![User Dashboard](docs/screenshots/user-dashboard.png)

### Store Owner Dashboard

Store owners can view their store information, average rating, total ratings, and customer rating details.

![Store Owner Dashboard](docs/screenshots/owner-dashboard.png)

### Admin Dashboard

Administrators can manage users and stores, view platform statistics, search and filter records, and manage different user roles.

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Change Password

Users and store owners can securely change their account password through the application interface.

![Change Password](docs/screenshots/change-password.png)

---
## Features

### Admin

- Secure admin login
- Dashboard statistics:
  - Total users
  - Total stores
  - Total ratings
- Create users
- Create administrators
- Create store owners
- Create stores
- Assign stores to store owners
- Search users
- Filter users by:
  - Name
  - Email
  - Address
  - Role
- Sort users ascending/descending by:
  - Name
  - Email
  - Address
  - Role
- Search stores
- Filter stores by:
  - Name
  - Email
  - Address
- Sort stores ascending/descending by:
  - Name
  - Email
  - Address
  - Rating
- View user details
- View store-owner/store rating information
- Logout

### Normal User

- Secure login
- Store listing
- Search stores by name
- Search stores by address
- View overall store rating
- View personal submitted rating
- Submit a rating from 1 to 5
- Modify an existing rating
- Sort stores by:
  - Name
  - Address
  - Overall rating
- Change password
- Logout

### Store Owner

- Secure login
- Owner dashboard
- View owner information
- View assigned stores
- View store name, email, and address
- View average rating
- View total ratings
- View customer rating list
- Sort customer ratings by:
  - User name
  - Email
  - Rating
  - Submitted date
- Change password
- Logout

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Lucide React

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Passport
- class-validator

### Development Tools

- Node.js
- npm
- Git
- GitHub
- Docker
- Docker Compose

---

## Architecture

```text
                    ┌─────────────────────┐
                    │       Browser          │
                    │    React + Vite        │
                    └──────────┬──────────┘
                               │
                               │ HTTP / JSON
                               ▼
                    ┌─────────────────────┐
                    │     NestJS API         │
                    │                        │
                    │ Authentication         │
                    │ Authorization          │
                    │ Admin Module           │
                    │ Users Module           │
                    │ Owner Module           │
                    │ Rating APIs            │
                    └──────────┬──────────┘
                                 │
                                 │ Prisma ORM
                                 ▼
                    ┌─────────────────────┐
                    │     PostgreSQL         │
                    │                        │
                    │ Users                  │
                    │ Stores                 │
                    │ Ratings                │
                    └─────────────────────┘
```

---

## Authentication and Authorization

StoreRate uses JWT-based authentication.

After successful login:

1. The backend validates the user's credentials.
2. A JWT access token is generated.
3. The frontend stores the authentication information.
4. Axios sends the JWT using the `Authorization` header.
5. NestJS guards validate the token.
6. Role-based guards restrict protected routes.

Supported roles:

```text
ADMIN
USER
STORE_OWNER
```

Each role has access only to its permitted dashboard and APIs.

---

## Validation

The backend validates user input using `class-validator`.

### Name

```text
Minimum: 20 characters
Maximum: 60 characters
```

### Address

```text
Maximum: 400 characters
```

### Password

```text
Minimum: 8 characters
Maximum: 16 characters
```

The password must contain:

- At least one uppercase letter
- At least one special character

### Email

A valid email format is required.

### Rating

Ratings must be an integer between:

```text
1 and 5
```

---

## Project Structure

```text
StoreRate/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── owner/
│   │   ├── prisma/
│   │   └── users/
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── owner/
│   │   │   └── user/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- PostgreSQL

Optional:

- Docker
- Docker Compose

---

## Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a local `.env` file:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/storerate?schema=public"
JWT_SECRET="your-development-secret"
```

> **Important:** Never commit `.env` to GitHub. The actual project `.env` file is excluded using `.gitignore`.

Generate Prisma Client:

```bash
npx prisma generate
```

Apply the database schema:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run start:dev
```

The backend runs on:

```text
http://localhost:3000
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will display the local URL in the terminal.

---

## Production Builds

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run build
```

Both projects should build without compilation errors.

---

## Main API Routes

### Authentication

```text
POST /auth/login
POST /auth/register
```

### User

```text
GET  /stores
POST /stores/:storeId/rating
```

### Store Owner

```text
GET /owner/dashboard
```

### Admin

```text
GET  /admin/dashboard
GET  /admin/users
GET  /admin/users/:id
POST /admin/users
GET  /admin/stores
POST /admin/stores
```

The complete API implementation is available in the backend source code.

---

## Security

StoreRate includes:

- JWT authentication
- Role-based authorization
- Protected frontend routes
- Protected backend routes
- Password hashing
- Input validation
- Environment-based database configuration
- Environment-based JWT secret
- CORS configuration

Sensitive configuration is intentionally excluded from Git.

---

## Database

StoreRate uses PostgreSQL with Prisma ORM.

The main application entities are:

```text
User
Store
Rating
```

Relationships:

```text
User
 ├── can submit Ratings
 └── can own Stores

Store
 └── has many Ratings

Rating
 ├── belongs to User
 └── belongs to Store
```

A user's rating for a store can be updated instead of creating multiple ratings for the same user/store combination.

---

## Role-Based Application Flow

```text
                         StoreRate
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
           ADMIN           USER       STORE_OWNER
             │              │              │
             ▼              ▼              ▼
        Admin Dashboard  User Dashboard  Owner Dashboard
             │              │              │
       ┌─────┼─────┐        │                 ┌─────┴─────┐
       │     │     │        │        │           │
     Users Stores Stats   Ratings   Stores    Ratings
       │     │              │
       │     │              │
       ▼     ▼              ▼
    Manage  Manage      Submit / Update
    Users   Stores        Rating
```

---

## Testing Checklist

Before deployment or submission, verify:

- [x] Admin login
- [x] User login
- [x] Store Owner login
- [x] User registration
- [x] Admin creates user
- [x] Admin creates store owner
- [x] Admin creates store
- [x] Store assignment
- [x] User store search
- [x] User rating submission
- [x] User rating modification
- [x] Admin filtering
- [x] Admin sorting
- [x] User store sorting
- [x] Store Owner rating sorting
- [x] User password change
- [x] Store Owner password change
- [x] Logout
- [x] Role-based route protection
- [x] Backend build
- [x] Frontend build

---

## GitHub Repository

The complete StoreRate project is maintained in a single Git repository containing both the frontend and backend.

**Repository:**  
https://github.com/Sachingupta209/StoreRate

The repository contains:

- React frontend
- NestJS backend
- Prisma schema
- PostgreSQL integration
- Docker Compose configuration
- Project documentation

Sensitive files such as `.env`, dependencies, build output, and local Docker database data are excluded using `.gitignore`.

---

## Future Improvements

Possible future enhancements include:

- Pagination for large datasets
- Advanced dashboard analytics
- Rating distribution charts
- Email notifications
- Automated deployment
- Docker-based production deployment
- CI/CD pipeline
- Comprehensive unit tests
- End-to-end testing
- Production monitoring and logging

---

## License

This project was developed as a software engineering challenge and portfolio project.
