# Campus ERP System

> A comprehensive full-stack **MERN** Campus ERP application for managing students, departments, attendance, marks, analytics, and administrative workflows from a single, intuitive dashboard.

## Overview

Campus ERP System is a production-ready learning application built with the **MERN stack** (MongoDB, Express, React, Node.js). It provides educational institutions with a complete solution for student information management, attendance tracking, academic performance monitoring, and administrative analytics—all in one place.

Built with **security-first principles**, the application features JWT-based authentication, role-based access control, MongoDB aggregation for advanced analytics, responsive mobile-friendly UI, and export-ready academic data.

---

## ✨ Features

### Authentication & Security
- ✅ **JWT-based Authentication** with secure token management
- ✅ **Role-Based Access Control** (RBAC) for admin-only operations
- ✅ **Protected Routes** on both frontend and backend
- ✅ **Password Hashing** with bcryptjs

### Student Management
- ✅ **Full CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Advanced Search & Filtering** by department, semester, status
- ✅ **Pagination** for handling large datasets efficiently
- ✅ **Student Profiles** with detailed information and history
- ✅ **Bulk Operations** for managing multiple students at once

### Department & Academic Organization
- ✅ **Department Management** for organizing students by academic divisions
- ✅ **Semester Tracking** across multiple academic years
- ✅ **Subject Management** with exam type classification

### Attendance Management
- ✅ **Date-based Attendance Tracking** with daily records
- ✅ **Department & Semester Filters** for organized attendance viewing
- ✅ **Bulk Attendance Actions** to mark all students present/absent at once
- ✅ **Duplicate Submission Prevention** for data integrity
- ✅ **Real-time Attendance Updates**

### Marks & Academic Performance
- ✅ **Exam Type Classification** (Midterm, Final, Quiz, etc.)
- ✅ **Subject-wise Score Tracking** with individual student records
- ✅ **CSV Export** for marks data in Excel-friendly format
- ✅ **Advanced Analytics Dashboard:**
  - Average Marks by Subject
  - Class Pass Rate Analysis
  - Top Performing Subjects
  - Lowest Scoring Subjects

### Dashboard & Analytics
- ✅ **Interactive Charts** using Recharts for data visualization
- ✅ **Summary Cards** for key metrics and KPIs
- ✅ **Real-time Analytics** showing system-wide statistics
- ✅ **At-Risk Student Monitoring** based on attendance and academic performance
- ✅ **Recent Activity Feed** tracking all administrative actions

### User Interface
- ✅ **Responsive Design** optimized for desktop, tablet, and mobile
- ✅ **Modern Sidebar Navigation** with intuitive menu structure
- ✅ **Professional Card-based Layouts** for data presentation
- ✅ **Toast Notifications** for user feedback
- ✅ **Clean & Professional Styling** with CSS

---

## 💻 Tech Stack

### Frontend Stack
| Technology | Purpose |
|-----------|---------|
| **React** | UI framework for building interactive components |
| **Vite** | Lightning-fast build tool and dev server |
| **React Router DOM** | Client-side routing and navigation |
| **Axios** | HTTP client for API communication |
| **Recharts** | Data visualization and interactive charts |
| **React Hot Toast** | Non-intrusive toast notifications |
| **React Icons** | Icon library for UI components |
| **CSS3** | Styling and responsive design |

### Backend Stack
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL document database |
| **Mongoose** | MongoDB object modeling |
| **JSON Web Token (JWT)** | Secure authentication tokens |
| **bcryptjs** | Password hashing and encryption |
| **CORS** | Cross-origin resource sharing |
| **Morgan** | HTTP request logging middleware |
| **dotenv** | Environment variable management |

### Database
| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | Cloud-hosted MongoDB (recommended) |
| **Local MongoDB** | Self-hosted database option |

---

## 📁 Project Structure

```
Mern_Stack/
├── my-backend/                 # Express.js + MongoDB Backend
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Department.js
│   │   ├── Attendance.js
│   │   ├── Mark.js
│   │   └── Activity.js
│   ├── routes/                 # API endpoint routes
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── markRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── activityRoutes.js
│   ├── controllers/            # Request handlers & business logic
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── departmentController.js
│   │   ├── attendanceController.js
│   │   ├── markController.js
│   │   ├── dashboardController.js
│   │   └── activityController.js
│   ├── middleware/             # Express middleware
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── config/                 # Configuration files
│   ├── server.js               # Express server entry point
│   ├── package.json
│   └── .env                    # Environment variables (create this)
│
├── my-frontend/                # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── dashboard/
│   │   │       ├── AnalyticsCards.jsx
│   │   │       ├── Charts.jsx
│   │   │       └── ActivityFeed.jsx
│   │   ├── pages/              # Page components (route-based)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Marks.jsx
│   │   │   └── Login.jsx
│   │   ├── context/            # React Context API
│   │   │   └── AuthContext.jsx
│   │   ├── services/           # API calls
│   │   │   └── api.jsx
│   │   ├── App.jsx             # Root app component
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # Vite entry point
│   ├── package.json
│   └── .env                    # Environment variables (create this)
│
├── screenshots/                # Project screenshots
│   ├── dashboard.png
│   ├── students.png
│   ├── attendance.png
│   └── marks.png
│
├── README.md                   # Project documentation
└── .gitignore
```

---

## 🚀 Installation Steps

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v20 or later ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** for cloning the repository
- **MongoDB Atlas account** or local MongoDB instance ([Setup Guide](https://www.mongodb.com/docs/manual/installation/))

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Mern_Stack
```

### Step 2: Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd my-backend
npm install
```

**Create a `.env` file** in the `my-backend` directory with the following configuration:

```env
# Server Configuration
PORT=8006
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin Credentials (for initial account creation)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Start the backend server:**

```bash
npm run dev
```

✅ Backend will be running at: `http://localhost:8006`  
✅ API base URL: `http://localhost:8006/api`

### Step 3: Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd my-frontend
npm install
```

**Create a `.env` file** in the `my-frontend` directory (optional, for custom API URL):

```env
VITE_API_URL=http://localhost:8006/api
```

**Start the frontend development server:**

```bash
npm run dev
```

✅ Frontend will be running at: `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

Use the default admin credentials to login:
- **Email:** `admin@example.com`
- **Password:** `change_this_password` (or as set in `.env`)

---

## 📝 Available Scripts

### Backend Scripts

```bash
# Development mode with auto-reload (Nodemon)
npm run dev

# Production mode
npm start

# Seed database with sample data
npm run seed
```

### Frontend Scripts

```bash
# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint code quality checks
npm run lint
```

---

## 🔌 API Endpoints

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Auth** | `POST /api/auth/register` | Register new admin user |
| | `POST /api/auth/login` | Admin login with JWT |
| | `GET /api/auth/me` | Get current authenticated user |
| **Students** | `GET /api/students` | List all students (with pagination) |
| | `POST /api/students` | Create new student |
| | `GET /api/students/:id` | Get student details |
| | `PUT /api/students/:id` | Update student information |
| | `DELETE /api/students/:id` | Delete student |
| | `GET /api/students/search` | Search students by name/ID |
| **Departments** | `GET /api/departments` | List all departments |
| | `POST /api/departments` | Create new department |
| | `PUT /api/departments/:id` | Update department |
| | `DELETE /api/departments/:id` | Delete department |
| **Attendance** | `GET /api/attendance` | Get attendance records (filtered) |
| | `POST /api/attendance` | Create attendance record |
| | `POST /api/attendance/bulk` | Bulk mark attendance |
| | `PUT /api/attendance/:id` | Update attendance |
| **Marks** | `GET /api/marks` | Get marks records |
| | `POST /api/marks` | Create mark entry |
| | `PUT /api/marks/:id` | Update mark |
| | `DELETE /api/marks/:id` | Delete mark |
| | `GET /api/marks/analytics` | Get marks analytics |
| | `GET /api/marks/export` | Export marks as CSV |
| **Dashboard** | `GET /api/dashboard/stats` | Dashboard statistics |
| | `GET /api/dashboard/trends` | Analytics trends |
| | `GET /api/dashboard/at-risk` | At-risk students |
| **Activities** | `GET /api/activities` | Recent activity feed |

---

## 👤 Default Admin Account

The backend automatically creates a default admin account on first startup if no admin exists.

**Configure default credentials via `.env` file:**

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
```

⚠️ **Important:** 
- Always change these credentials for production
- Never commit real passwords to version control
- Use strong, complex passwords in production
- Consider using environment-specific `.env` files

---

## 🎯 Future Improvements

### Real-Time Features
- [ ] **Real-time Notifications** - Push notifications for attendance updates and alerts
- [ ] **WebSocket Integration** - Live activity updates without page refresh
- [ ] **Email Notifications** - Automated email alerts for critical events

### Reports & Export
- [ ] **PDF Reports** - Generate professional PDF reports for students, departments, and attendance
- [ ] **Advanced Export** - Export filtered data with custom templates
- [ ] **Scheduled Reports** - Automatic report generation and email delivery

### Analytics & Insights
- [ ] **Advanced Analytics Dashboard** - Deeper insights by semester, department, and subject
- [ ] **Predictive Analytics** - Identify at-risk students using ML models
- [ ] **Performance Benchmarking** - Compare student/department performance trends

### Role Management
- [ ] **Student Portal** - Student-specific dashboard to view personal marks and attendance
- [ ] **Teacher/Faculty Dashboard** - Teachers can input marks and manage classes
- [ ] **Parent Portal** - Parents can view student progress reports
- [ ] **Role-specific Dashboards** - Customized views for different user types

### Account & Security
- [ ] **Password Reset** - Secure password reset via email
- [ ] **Email Verification** - Account verification and activation
- [ ] **Two-Factor Authentication (2FA)** - Enhanced security with OTP
- [ ] **Session Management** - Better control over active sessions

### Student Management
- [ ] **Profile Photo Upload** - Student profile pictures with image optimization
- [ ] **Document Management** - Upload and store student documents
- [ ] **Medical/Health Records** - Student health information system
- [ ] **Achievements & Certifications** - Track student accomplishments

### Testing & Code Quality
- [ ] **Unit Tests** - Jest test suite for backend APIs
- [ ] **Integration Tests** - End-to-end workflow testing
- [ ] **Frontend Test Coverage** - React Testing Library for components
- [ ] **E2E Testing** - Cypress or Playwright for full-stack testing

### UI/UX Enhancements
- [ ] **Dark Mode** - System-wide dark theme support
- [ ] **Theme Customization** - Allow users to customize colors and layouts
- [ ] **Accessibility Improvements** - WCAG 2.1 compliance
- [ ] **Mobile App** - React Native mobile version

### DevOps & Deployment
- [ ] **Deployment Guides** - Documentation for Render, Vercel, and Heroku
- [ ] **Docker Support** - Containerization for easy deployment
- [ ] **CI/CD Pipeline** - GitHub Actions automation
- [ ] **Monitoring & Logging** - Application performance monitoring

### Data & Compliance
- [ ] **Audit Logs** - Complete audit trail for all admin actions
- [ ] **Data Privacy** - GDPR/Privacy compliance features
- [ ] **Backup & Recovery** - Automated database backups
- [ ] **Data Retention Policies** - Configurable data retention

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your `MONGO_URI` is correct in `.env`
- Ensure MongoDB Atlas IP whitelist includes your current IP
- Check if your MongoDB connection string includes the correct database name

### Port Already in Use
```bash
# Kill process using port 8006 (backend)
lsof -ti:8006 | xargs kill -9

# Kill process using port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### API Not Responding
- Ensure backend is running: `npm run dev` in `my-backend`
- Check `CORS` settings in backend server configuration
- Verify `CLIENT_URL` environment variable matches frontend URL

### Database Seeding Issues
```bash
# Clear existing data and reseed
cd my-backend
npm run seed
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MERN Stack Tutorial](https://www.freecodecamp.org/learn/mern-stack/)
- [JWT Authentication](https://jwt.io/introduction)
- [Vite Documentation](https://vitejs.dev/)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please ensure:
- Code follows project conventions
- All existing tests pass
- New features include appropriate tests
- Documentation is updated

---

## 📄 License

This project is developed for **academic and educational purposes**.

Use, modification, and distribution are permitted for educational contexts.

---

## 🎓 Project Status

**Current Version:** 1.0.0  
**Status:** ✅ Active Development  
**Last Updated:** 2026-06-22

---

**Happy Coding! 🚀**
