# Frontend Setup Instructions

## Port Configuration

Your backend has been configured to accept requests from your frontend running on **Port 3001**.

## Frontend Setup Commands

### For React (Create React App)
```bash
# Navigate to your frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server on port 3001
PORT=3001 npm start
```

### For React (Vite)
```bash
# Navigate to your frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server on port 3001
npm run dev -- --port 3001
```

### For Next.js
```bash
# Navigate to your frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server on port 3001
npm run dev -p 3001
```

### For Angular
```bash
# Navigate to your frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server on port 3001
ng serve --port 3001
```

### For Vue.js
```bash
# Navigate to your frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server on port 3001
npm run serve -- --port 3001
```

## Alternative: Environment Variable Method

You can also create a `.env` file in your frontend root directory:

```bash
# Create .env file
echo "PORT=3001" > .env

# Then run your normal start command
npm start
```

## Backend Configuration

✅ **Backend URL**: `http://localhost:8080`
✅ **Frontend URL**: `http://localhost:3001`
✅ **CORS Configured**: Backend accepts requests from port 3001
✅ **Authentication**: JWT-based authentication working

## API Base URL

When setting up your frontend, use this base URL for API calls:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Test Authentication

You can test the backend API with these demo accounts:

### Admin Account
- **Email**: admin@university.edu
- **Password**: admin123

### Lecturer Account
- **Email**: lecturer@university.edu
- **Password**: lecturer123

### Student Account
- **Email**: student@university.edu
- **Password**: student123

## Example API Calls

### Login
```javascript
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@university.edu',
    password: 'admin123'
  })
})
```

### Get Courses (Admin)
```javascript
fetch('http://localhost:8080/api/admin/courses', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
```

Your backend is now ready to accept requests from your frontend running on port 3001!
