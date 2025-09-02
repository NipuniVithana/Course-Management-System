# Course Management System - Frontend

A modern React.js frontend application for the Course Management System with role-based access control and comprehensive course management features.

## Features

### 🔴 Admin Features
- **System Management**: Full system control and oversight
- **User Management**: Manage all users (Lecturers & Students)
- **Course Management**: Create, edit, delete courses and assign lecturers
- **Degree Management**: Manage degree programs and course mappings
- **Analytics Dashboard**: System-wide statistics and reports
- **Data Export**: Export system data and reports

### 🟡 Lecturer Features
- **Course Registration**: Register/unregister for available courses
- **Student Management**: View enrolled students in registered courses
- **Assignment Management**: Create, upload, and manage assignments
- **Course Materials**: Upload and manage course materials (PDFs, documents)
- **Grade Management**: Grade student submissions and provide feedback
- **Course Analytics**: Track student performance and engagement
- **Assignment Submissions**: View and download student assignment submissions

### 🔵 Student Features
- **Course Browsing**: Browse all available courses in the system
- **Course Enrollment**: Enroll in available courses
- **Assignment Submission**: Submit assignments with file uploads
- **Academic Progress**: View grades, assignments, and course materials
- **Course Materials**: Download course materials uploaded by lecturers
- **Profile Management**: Update personal information

## Technology Stack

- **React.js 18+** - Frontend framework
- **Ant Design (antd)** - UI component library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Context** - State management
- **Day.js** - Date manipulation library
- **Modern JavaScript (ES6+)** - Programming language

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Or create .env file with:
   echo "PORT=3001" > .env
   echo "REACT_APP_API_URL=http://localhost:8080/api" >> .env
   ```

4. **Start development server**:
   ```bash
   npm start
   ```

5. **Open your browser**:
   - Application will be available at: `http://localhost:3001`
   - The page will automatically reload when you make changes

### Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components (Login, Register)
│   ├── admin/             # Admin dashboard and management components
│   │   ├── AdminDashboard.jsx    # Admin dashboard with statistics
│   │   ├── Students.jsx          # Student management
│   │   ├── Lecturers.jsx         # Lecturer management
│   │   ├── Courses.jsx           # Course management
│   │   ├── AddCourse.jsx         # Course creation form
│   │   └── Degrees.jsx           # Degree program management
│   ├── lecturer/          # Lecturer dashboard and course management
│   │   ├── LecturerDashboard.jsx # Lecturer dashboard with statistics
│   │   ├── MyCourses.jsx         # Lecturer's registered courses
│   │   └── CourseManagement.jsx  # Course details, materials, assignments
│   ├── student/           # Student dashboard and course interaction
│   │   └── StudentDashboard.jsx  # Student dashboard with enrollment info
│   └── common/            # Shared components across roles
│       ├── AllCourses.jsx        # Course browsing for all roles
│       ├── Profile.jsx           # User profile management
│       ├── Layout.jsx            # Common layout wrapper
│       └── ProtectedRoute.jsx    # Route protection by role
├── context/
│   └── AuthContext.js     # Authentication state management
├── services/
│   ├── authService.js     # Authentication API calls
│   ├── adminService.js    # Admin API calls
│   ├── lecturerService.js # Lecturer API calls
│   └── studentService.js  # Student API calls
├── App.js                 # Main application component with routing
└── index.js               # Application entry point
```

## Demo Credentials

For testing purposes, you can use these demo credentials:

- **Admin**: admin@university.edu / admin123
- **Lecturer**: lecturer@university.edu / lecturer123
- **Student**: student@university.edu / student123

## API Configuration

The frontend is configured to connect to the backend API:
- **Development**: `http://localhost:8080/api` (runs on port 3001)
- **Backend Port**: 8080
- **Frontend Port**: 3001 (configured in .env)
- **Production**: Set `REACT_APP_API_URL` environment variable

## Environment Variables

Create a `.env` file in the frontend root directory:

```
PORT=3001
REACT_APP_API_URL=http://localhost:8080/api
```

## Available Scripts

- `npm start` - Runs the app in development mode on port 3001
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Features in Detail

### Course Management System
- **Unified Course Browsing**: All roles can browse available courses
- **Role-based Registration**: Lecturers can register for courses they want to teach
- **Student Enrollment**: Students can enroll in courses taught by registered lecturers
- **File Upload/Download**: Support for course materials and assignment submissions
- **Real-time Statistics**: Live dashboard data for all roles

### Assignment & Grading System
- **Assignment Creation**: Lecturers can create assignments with file requirements
- **File Submission**: Students can submit assignments with file attachments
- **Grading Interface**: Lecturers can grade submissions and provide feedback
- **Grade Tracking**: Students can view their grades and assignment feedback

### Authentication System
- JWT-based authentication with role-based access
- Session management and automatic token refresh
- Protected routes based on user roles
- Secure logout with token cleanup

### UI/UX Features
- **Ant Design Components**: Modern, consistent UI components
- **Responsive Design**: Mobile-friendly interface optimized for all devices
- **Role-specific Themes**: Different layouts and features per user role
- **Loading States**: Comprehensive loading indicators and error handling
- **Real-time Updates**: Live data refresh without page reload

## Dependencies

### Core Dependencies
- **react**: ^18.2.0 - React framework
- **react-dom**: ^18.2.0 - React DOM rendering
- **react-router-dom**: ^6.8.0 - Client-side routing
- **antd**: ^5.8.0 - Ant Design UI components
- **@ant-design/icons**: ^5.2.0 - Ant Design icon set
- **axios**: ^1.3.0 - HTTP client for API calls
- **dayjs**: ^1.11.17 - Date manipulation library

### Development Dependencies
- **react-scripts**: 5.0.1 - Create React App build tools
- **@testing-library/react**: ^13.3.0 - Testing utilities
- **@testing-library/jest-dom**: ^5.16.4 - Jest DOM matchers

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Optimization

- Code splitting with React.lazy()
- Optimized bundle size
- Efficient re-rendering with React hooks
- Lazy loading of components
- Image optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed description

## License

This project is part of an educational assignment for Modern Enterprise Application Development.
