# Course Management System - Frontend

A modern React.js frontend application for the Course Management System with role-based access control.

## Features

### 🔴 Admin Features
- **System Management**: Full system control and oversight
- **User Management**: Manage all users (Lecturers & Students)
- **Course Management**: Create, assign courses to lecturers
- **Analytics Dashboard**: System-wide statistics and reports

### 🟡 Lecturer Features
- **Student Management**: View enrolled students in their courses
- **Assessment Management**: Create assignments, exams, grade submissions
- **Grade Management**: Enter and update grades for their courses
- **Course Analytics**: Track student performance

### 🔵 Student Features
- **Course Enrollment**: Browse and enroll in available courses
- **Academic Progress**: View grades and GPA
- **Assignment Submission**: Submit assignments and view feedback
- **Profile Management**: Update personal information and preferences

## Technology Stack

- **React.js 18+** - Frontend framework
- **Material-UI (MUI)** - UI component library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Context** - State management
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

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   - Application will be available at: `http://localhost:3000`
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
│   ├── auth/              # Authentication components
│   ├── admin/             # Admin dashboard components
│   ├── lecturer/          # Lecturer dashboard components
│   ├── student/           # Student dashboard components
│   └── common/            # Shared components
├── context/
│   └── AuthContext.js     # Authentication state management
├── services/
│   ├── authService.js     # Authentication API calls
│   ├── adminService.js    # Admin API calls
│   ├── lecturerService.js # Lecturer API calls
│   └── studentService.js  # Student API calls
├── utils/
│   ├── constants.js       # Application constants
│   └── helpers.js         # Utility functions
├── App.js                 # Main application component
└── index.js               # Application entry point
```

## Demo Credentials

For testing purposes, you can use these demo credentials:

- **Admin**: admin@university.edu / admin123
- **Lecturer**: lecturer@university.edu / lecturer123
- **Student**: student@university.edu / student123

## API Configuration

The frontend expects the backend API to be running on:
- **Development**: `http://localhost:8080`
- **Production**: Set `REACT_APP_API_URL` environment variable

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Environment Variables

Create a `.env` file in the frontend root directory:

```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_APP_NAME=Course Management System
```

## Features in Detail

### Authentication System
- JWT-based authentication
- Role-based access control
- Session management
- Password reset functionality

### Role-Based UI
- Different themes for each role
- Role-specific navigation
- Protected routes
- Permission-based feature access

### Responsive Design
- Mobile-friendly interface
- Tablet optimized layouts
- Desktop full-feature experience
- Cross-browser compatibility

### Real-time Features
- Live data updates
- Notification system
- Progress tracking
- Status updates

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
