# Campus ERP Backend API

Node.js, Express.js, and MongoDB backend for the Campus ERP application.

## Overview

The Campus ERP Backend provides REST APIs for authentication, student management, attendance tracking, marks management, profile aggregation, and dashboard analytics.

## Features

* JWT Authentication
* Role-Based Access Control (Admin Middleware)
* Student CRUD Operations
* Attendance CRUD Operations
* Marks CRUD Operations
* Student Profile Aggregation
* Dashboard Analytics
* MongoDB Database Integration
* In-Memory MongoDB Fallback for Local Development
* Automatic Default Admin User Creation

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* dotenv
* cors
* morgan

## Prerequisites

Before running the project, ensure you have:

* Node.js 20 or later
* npm
* MongoDB connection URI (optional for production, required for persistent storage)

## Installation

1. Navigate to the backend project directory:

```bash
cd my-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=8006
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
```

4. Seed the database with sample data (optional):

```bash
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

5. Or start the production server:

```bash
npm start
```

## API Base URL

```text
http://localhost:8006/api
```

## API Endpoints

### Authentication

| Method | Endpoint             | Access    |
| ------ | -------------------- | --------- |
| POST   | `/api/auth/register` | Public    |
| POST   | `/api/auth/login`    | Public    |
| GET    | `/api/auth/me`       | Protected |

### Students

| Method | Endpoint                    | Access    |
| ------ | --------------------------- | --------- |
| GET    | `/api/students`             | Protected |
| POST   | `/api/students`             | Admin     |
| GET    | `/api/students/:id`         | Protected |
| PUT    | `/api/students/:id`         | Admin     |
| DELETE | `/api/students/:id`         | Admin     |
| GET    | `/api/students/:id/profile` | Protected |

### Attendance

| Method | Endpoint              | Access    |
| ------ | --------------------- | --------- |
| GET    | `/api/attendance`     | Protected |
| POST   | `/api/attendance`     | Admin     |
| PUT    | `/api/attendance/:id` | Admin     |
| DELETE | `/api/attendance/:id` | Admin     |

### Marks

| Method | Endpoint         | Access    |
| ------ | ---------------- | --------- |
| GET    | `/api/marks`     | Protected |
| POST   | `/api/marks`     | Admin     |
| DELETE | `/api/marks/:id` | Admin     |

### Dashboard

| Method | Endpoint                          | Access    |
| ------ | --------------------------------- | --------- |
| GET    | `/api/dashboard/stats`            | Protected |
| GET    | `/api/dashboard/attendance-trend` | Protected |
| GET    | `/api/dashboard/subject-averages` | Protected |

## Project Structure

```text
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── config/
└── server.js
```

## Authentication

* JWT tokens are issued upon successful login.
* Protected routes require a valid Bearer token.
* Admin-only routes require both authentication and admin privileges.

Example header:

```http
Authorization: Bearer <token>
```

## Database

### MongoDB Collections

* users
* students
* attendance
* marks

### Development Mode

If `MONGO_URI` is not provided, the application automatically starts an in-memory MongoDB instance for local development and testing.

## Default Admin User

On startup, the application automatically creates a default administrator account if no admin user exists in the database.

Configure the default credentials through environment variables or update them after first login.

## Available Scripts

| Command       | Description                               |
| ------------- | ----------------------------------------- |
| `npm run dev` | Start development server with auto-reload |
| `npm run seed` | Seed the database with sample data      |
| `npm start`   | Start production server                   |

## Notes

* Ensure the frontend API URL matches the backend port configuration.
* Keep `JWT_SECRET` secure and never commit it to version control.
* Use a persistent MongoDB database in production environments.

## Author

Campus ERP Project
