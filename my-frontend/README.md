# Campus ERP Frontend

React + Vite frontend application for the Campus ERP system.

## Overview

The Campus ERP Frontend provides a modern web interface for managing academic and administrative operations, including student records, attendance tracking, marks management, and dashboard analytics.

## Features

* User Authentication and Authorization
* Protected Route Handling
* Dashboard Analytics with Charts
* Student Management
* Attendance Management
* Marks Management
* Student Profile Pages
* Role-Based Access Interface
* Responsive User Interface

## Tech Stack

* React.js
* Vite
* React Router DOM
* Axios
* React Hot Toast
* Recharts
* CSS

## Prerequisites

Before running the project, ensure you have:

* Node.js 20 or later
* npm

## Installation

1. Navigate to the frontend project directory:

```bash
cd my-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the application in your browser:

```text
http://localhost:5173
```

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint checks                    |

## Project Structure

```text
src/
├── components/
├── context/
├── layouts/
├── pages/
├── routes/
├── services/
└── App.jsx
```

## API Configuration

The frontend communicates with the backend API through the service layer.

Default API endpoint:

```text
http://localhost:8006/api
```

If environment-based configuration is enabled, create a `.env` file or use the project `.env.example` as a template:

```env
VITE_API_URL=http://localhost:8006/api
```

For deployment, use the backend URL:

```env
VITE_API_URL=https://campus-erp.onrender.com/api
```

Example usage:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## Authentication

* Authentication tokens are stored in `localStorage`.
* Tokens are automatically attached to API requests.
* Protected pages are secured using the `ProtectedRoute` component.

## Development Notes

* API requests are managed through `src/services/api.jsx`.
* Ensure the backend server is running before starting the frontend.
* Update the API URL if the backend runs on a different host or port.

## Author

Campus ERP Project
