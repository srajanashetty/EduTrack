# edutrack – Student Performance and Attendance Analytics System

A full-stack web application for educational institutions to track student attendance, manage marks, and generate performance analytics dashboards.

![edutrack](https://img.shields.io/badge/edutrack-v1.0-6366f1?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Default Roles](#default-roles)

---

## 🛠 Tech Stack

### Frontend
- **React.js 18** (Vite)
- **Chart.js** with react-chartjs-2
- **React Router v6**
- **Axios** for HTTP requests
- **React Icons**

### Backend
- **Java 17**
- **Spring Boot 3.2.3**
- **Spring Security** with JWT Authentication
- **Spring Data JPA**
- **Lombok**

### Database
- **MySQL 8.0**

---

## 📁 Project Structure

```
student/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/edutrack/
│       ├── edutrackApplication.java
│       ├── config/
│       │   ├── JwtAuthFilter.java
│       │   ├── JwtUtil.java
│       │   └── SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── StudentController.java
│       │   ├── AttendanceController.java
│       │   ├── MarksController.java
│       │   └── AnalyticsController.java
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── LoginResponse.java
│       │   ├── RegisterRequest.java
│       │   ├── AttendanceRequest.java
│       │   ├── MarksRequest.java
│       │   └── StudentDTO.java
│       ├── entity/
│       │   ├── Student.java
│       │   ├── Teacher.java
│       │   ├── Attendance.java
│       │   ├── Marks.java
│       │   ├── User.java
│       │   └── Role.java
│       ├── repository/
│       │   ├── StudentRepository.java
│       │   ├── TeacherRepository.java
│       │   ├── AttendanceRepository.java
│       │   ├── MarksRepository.java
│       │   └── UserRepository.java
│       └── service/
│           ├── AuthService.java
│           ├── StudentService.java
│           ├── AttendanceService.java
│           ├── MarksService.java
│           ├── AnalyticsService.java
│           └── CustomUserDetailsService.java
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── StudentManagement.jsx
│       │   ├── AttendanceManagement.jsx
│       │   ├── MarksUpload.jsx
│       │   ├── AnalyticsDashboard.jsx
│       │   ├── Reports.jsx
│       │   ├── Navbar.jsx
│       │   └── PrivateRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── services/
│           └── api.js
└── README.md
```

---

## ✅ Prerequisites

- **Java 17+** (JDK)
- **Maven** (3.8+)
- **Node.js** (18+) and **npm**
- **MySQL** (8.0+)

---

## 🚀 Setup Instructions

### 1. Database Setup

```sql
CREATE DATABASE edutrack_db;
```

### 2. Backend Setup

```bash
cd backend

# Update application.properties with your MySQL credentials
# Edit: src/main/resources/application.properties
# Change DB_PASSWORD to your MySQL password

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done if cloned)
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:5173**

### 4. Environment Variables (Optional)

You can set these environment variables instead of editing `application.properties`:

```bash
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=edutrack_db
set DB_USERNAME=root
set DB_PASSWORD=your_password
set JWT_SECRET=your_jwt_secret_key
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get JWT token |
| POST | `/auth/register` | Register new user |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/students` | Create student (ADMIN) |
| GET | `/students` | Get all students |
| GET | `/students/{id}` | Get student by ID |
| PUT | `/students/{id}` | Update student (ADMIN) |
| DELETE | `/students/{id}` | Delete student (ADMIN) |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/attendance/mark` | Mark single attendance |
| POST | `/attendance/mark/bulk` | Mark bulk attendance |
| GET | `/attendance/student/{id}` | Get student attendance |
| GET | `/attendance/student/{id}/stats` | Get student stats |
| GET | `/attendance/class` | Get class attendance |

### Marks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/marks` | Add single mark |
| POST | `/marks/bulk` | Add bulk marks |
| GET | `/marks/student/{id}` | Get student marks |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/attendance` | Attendance analytics |
| GET | `/analytics/performance` | Performance analytics |
| GET | `/analytics/top-students` | Top performing students |
| GET | `/analytics/low-attendance` | Low attendance alerts |

---

## ✨ Features

- 🔐 **JWT Authentication** with role-based access control
- 👥 **Student CRUD** operations
- 📋 **Attendance Tracking** with bulk marking
- 📝 **Marks Management** with single and bulk upload
- 📊 **Analytics Dashboard** with Chart.js visualizations
  - Bar charts for student performance
  - Pie charts for attendance distribution
  - Line charts for progress trends
- 📄 **Reports** with CSV export and print
- 🌙 **Dark Mode** premium UI design
- 📱 **Responsive** design for all devices

---

## 👤 Default Roles

| Role | Permissions |
|------|------------|
| **ADMIN** | Manage students, view analytics, generate reports, full access |
| **TEACHER** | Mark attendance, upload marks, view class analytics |
| **STUDENT** | View own attendance and marks |

### Quick Start

1. Register an ADMIN user first:
   - Go to **http://localhost:5173**
   - Click "Register" tab
   - Select role as "Admin"
   - Create your account

2. Add students, mark attendance, and upload marks

3. View the analytics dashboard for insights!

---

## 📄 License

This project is for educational purposes.
