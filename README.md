\# StoreRate



A full-stack store rating platform where users can discover stores, submit ratings, and manage their ratings. Administrators can manage users and stores, while store owners can monitor ratings for their stores.



\## Overview



StoreRate is a role-based web application built with a NestJS backend, React frontend, and PostgreSQL database.



The application provides three different roles:



\- \*\*ADMIN\*\* — manages users, stores, and platform statistics.

\- \*\*USER\*\* — searches stores and submits or updates ratings.

\- \*\*STORE\_OWNER\*\* — views store information, ratings, and average ratings.



Authentication is implemented using JWT, with role-based route protection and server-side validation.



\---



\## Features



\### Admin



\- Secure admin login

\- Dashboard statistics

&#x20; - Total users

&#x20; - Total stores

&#x20; - Total ratings

\- Create users

\- Create administrators

\- Create store owners

\- Create stores

\- Assign stores to store owners

\- Search users

\- Filter users by:

&#x20; - Name

&#x20; - Email

&#x20; - Address

&#x20; - Role

\- Sort users ascending/descending by:

&#x20; - Name

&#x20; - Email

&#x20; - Address

&#x20; - Role

\- Search stores

\- Filter stores by:

&#x20; - Name

&#x20; - Email

&#x20; - Address

\- Sort stores ascending/descending by:

&#x20; - Name

&#x20; - Email

&#x20; - Address

&#x20; - Rating

\- View user details

\- View store-owner/store rating information

\- Logout



\### Normal User



\- Secure login

\- Store listing

\- Search stores by name

\- Search stores by address

\- View overall store rating

\- View personal submitted rating

\- Submit a rating from 1 to 5

\- Modify an existing rating

\- Sort stores by:

&#x20; - Name

&#x20; - Address

&#x20; - Overall rating

\- Change password

\- Logout



\### Store Owner



\- Secure login

\- Owner dashboard

\- View owner information

\- View assigned stores

\- View store name, email, and address

\- View average rating

\- View total ratings

\- View customer rating list

\- Sort customer ratings by:

&#x20; - User name

&#x20; - Email

&#x20; - Rating

&#x20; - Submitted date

\- Change password

\- Logout



\---



\## Technology Stack



\### Frontend



\- React

\- Vite

\- React Router

\- Axios

\- Lucide React



\### Backend



\- NestJS

\- TypeScript

\- Prisma ORM

\- PostgreSQL

\- JWT Authentication

\- Passport

\- class-validator



\### Development Tools



\- Node.js

\- npm

\- Git

\- GitHub

\- Docker / Docker Compose



\---



\## Architecture



```text

&#x20;                   ┌─────────────────────┐

&#x20;                   │       Browser       │

&#x20;                   │    React + Vite     │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              │ HTTP / JSON

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │     NestJS API      │

&#x20;                   │                     │

&#x20;                   │ Authentication      │

&#x20;                   │ Authorization       │

&#x20;                   │ Admin Module        │

&#x20;                   │ Users Module        │

&#x20;                   │ Owner Module        │

&#x20;                   │ Rating APIs         │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              │ Prisma ORM

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │     PostgreSQL      │

&#x20;                   │                     │

&#x20;                   │ Users               │

&#x20;                   │ Stores              │

&#x20;                   │ Ratings             │

&#x20;                   └─────────────────────┘

