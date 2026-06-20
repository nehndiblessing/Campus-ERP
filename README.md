# Campus ERP Full Stack

This repository contains a full-stack Campus ERP application with separate frontend and backend folders.

## Structure

- `my-backend/` - Express.js backend for authentication, students, attendance, marks, and dashboard analytics
- `my-frontend/` - React + Vite frontend for user interface, protected routes, dashboards, and forms

## Setup

### Backend

1. Open a terminal in `my-backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create/update `.env` with:
   ```env
   PORT=8006
   MONGO_URI=<your-mongo-uri>
   JWT_SECRET=<your-secret>
   ```
4. Start the backend:
   ```bash
   npm start
   ```

### Frontend

1. Open a terminal in `my-frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

## Notes

- The frontend expects the backend API at `http://localhost:8006/api`.
- Backend protected routes require a valid JWT stored in `localStorage`.
- There is a default admin user created automatically if none exists.

## Useful commands

- Backend:
  - `npm start` - run the Express server
  - `npm run dev` - run the backend with nodemon
- Frontend:
  - `npm run dev` - start Vite dev server
  - `npm run build` - build the frontend
  - `npm run lint` - run ESLint
