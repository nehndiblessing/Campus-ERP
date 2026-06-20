# Campus ERP System

A full-stack College ERP application built with the MERN stack (MongoDB, Express.js, React.js, and Node.js) to streamline academic and administrative operations within an educational institution.

The system provides a centralized platform for managing student records, attendance, academic marks, user authentication, and dashboard analytics. It demonstrates modern web development practices, RESTful API design, secure authentication, database management, and responsive user interface development.

## Features

* Secure JWT Authentication
* Role-Based Access Control
* Student Management System (CRUD)
* Attendance Management
* Marks Management
* Dashboard Analytics
* Protected Routes
* MongoDB Atlas Integration
* RESTful APIs
* Responsive User Interface

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* React Hot Toast
* Recharts

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* Mongoose

### Database

* MongoDB Atlas

## Project Structure

```text
Campus-ERP/
│
├── my-frontend/     # React + Vite Frontend
│
├── my-backend/      # Express.js Backend
│
└── README.md
```

### Frontend (`my-frontend`)

* Authentication Pages
* Dashboard
* Student Management
* Attendance Management
* Marks Management
* Protected Routes
* Analytics & Charts

### Backend (`my-backend`)

* Authentication APIs
* Student APIs
* Attendance APIs
* Marks APIs
* Dashboard Analytics APIs
* JWT Middleware
* MongoDB Integration

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Campus-ERP
```

---

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd my-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file or copy from `.env.example`:

```env
PORT=8006
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

or

```bash
npm start
```

Backend will run on:

```text
http://localhost:8006
```

---

### 3. Frontend Setup

Navigate to the frontend folder:

```bash
cd my-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

## API Configuration

The frontend is configured to communicate with:

```text
http://localhost:8006/api
```

Update the API base URL if deploying the backend to a different server.

## Default Admin Account

If no admin account exists, the backend automatically creates one during initialization.

Demo credentials (for demo/testing purposes only):

```
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456
```

These credentials are seeded on startup when no admin exists. For production deployments, change the admin password and set secure environment variables on your host provider. Do not commit real credentials to the repository.

## Available Scripts

### Backend

```bash
npm start
```

Run the production server.

```bash
npm run dev
```

Run the server using Nodemon.

### Frontend

```bash
npm run dev
```

Start the Vite development server.

```bash
npm run build
```

Build the application for production.

```bash
npm run lint
```

Run ESLint checks.

## Project Modules

1. Authentication Module
2. Student Management Module
3. Attendance Management Module
4. Marks Management Module
5. Dashboard Analytics Module
6. User Profile Module

## Learning Outcomes

This project demonstrates:

* Full-Stack MERN Development
* REST API Design
* JWT Authentication & Authorization
* MongoDB Database Design
* CRUD Operations
* State Management
* Protected Routing
* Dashboard Analytics
* Responsive UI Development

## License

This project was developed for academic and educational purposes.
