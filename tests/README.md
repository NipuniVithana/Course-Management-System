# Course Management System - Testing Guide

This document outlines the testing strategy and procedures for the Course Management System.

## 🧪 **Testing Overview**

### **Testing Types**
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Complete user workflow testing
- **API Tests**: Postman collection for API validation

### **Testing Tools**
- **Backend**: JUnit 5, Mockito, Spring Boot Test
- **Frontend**: Jest, React Testing Library
- **API**: Postman/Newman
- **E2E**: Cypress (optional)

---

## 🔧 **Backend Testing**

### **Unit Tests Location**
```
backend/src/test/java/com/university/cms/
├── controller/     # Controller tests
├── service/        # Service layer tests
├── repository/     # Repository tests
├── security/       # Security tests
└── util/          # Utility tests
```

### **Running Backend Tests**
```bash
cd backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthControllerTest

# Run tests with coverage
mvn jacoco:prepare-agent test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### **Test Configuration**
```yaml
# application-test.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
  test:
    database:
      replace: none
```

---

## ⚛️ **Frontend Testing**

### **Test Structure**
```
frontend/src/
├── __tests__/           # Test files
├── components/
│   └── __tests__/      # Component tests
├── services/
│   └── __tests__/      # Service tests
└── utils/
    └── __tests__/      # Utility tests
```

### **Running Frontend Tests**
```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test AuthContext.test.js
```

### **Test Configuration**
```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "npm test -- --coverage --watchAll=false",
    "test:ci": "CI=true npm test -- --coverage --watchAll=false"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/reportWebVitals.js"
    ]
  }
}
```

---

## 📡 **API Testing**

### **Postman Collection**
The API tests are available in `tests/api-tests.postman.json`

#### **Import into Postman**
1. Open Postman
2. Click "Import"
3. Select `api-tests.postman.json`
4. Set environment variables:
   - `baseUrl`: http://localhost:8080/api
   - `authToken`: (automatically set after login)

#### **Running API Tests**
```bash
# Install Newman (Postman CLI)
npm install -g newman

# Run all API tests
newman run tests/api-tests.postman.json

# Run with environment file
newman run tests/api-tests.postman.json -e environment.json

# Generate HTML report
newman run tests/api-tests.postman.json --reporters html --reporter-html-export report.html
```

### **Test Categories**
1. **Authentication Tests**
   - Valid login for all roles
   - Invalid credentials
   - Token validation
   - User profile retrieval

2. **Admin Tests**
   - Course CRUD operations
   - User management
   - System administration

3. **Lecturer Tests**
   - Course access
   - Assignment management
   - Student interactions

4. **Student Tests**
   - Course browsing
   - Enrollment
   - Assignment submission

5. **Error Handling**
   - Unauthorized access
   - Invalid resources
   - Validation errors

---

## 🎯 **Test Coverage Goals**

### **Backend Coverage Targets**
- **Overall**: 80%+
- **Service Layer**: 90%+
- **Controller Layer**: 85%+
- **Repository Layer**: 70%+

### **Frontend Coverage Targets**
- **Components**: 80%+
- **Services**: 90%+
- **Utilities**: 85%+
- **Overall**: 75%+

---

## 🚀 **Continuous Integration**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 11
        uses: actions/setup-java@v2
        with:
          java-version: '11'
      - name: Run backend tests
        run: |
          cd backend
          mvn test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Run frontend tests
        run: |
          cd frontend
          npm install
          npm test -- --coverage --watchAll=false

  api-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests]
    steps:
      - uses: actions/checkout@v2
      - name: Start application
        run: docker-compose up -d
      - name: Wait for services
        run: sleep 30
      - name: Run API tests
        run: newman run tests/api-tests.postman.json
```

---

## 📊 **Test Reports**

### **Backend Test Reports**
```bash
# Generate Surefire reports
mvn surefire-report:report

# Generate JaCoCo coverage report
mvn jacoco:report

# View reports
open target/site/surefire-report.html
open target/site/jacoco/index.html
```

### **Frontend Test Reports**
```bash
# Generate coverage report
npm test -- --coverage --watchAll=false

# View coverage report
open coverage/lcov-report/index.html
```

### **API Test Reports**
```bash
# Generate Newman HTML report
newman run tests/api-tests.postman.json --reporters html --reporter-html-export api-test-report.html

# Generate JUnit XML report
newman run tests/api-tests.postman.json --reporters junit --reporter-junit-export results.xml
```

---

## 🐛 **Debugging Tests**

### **Backend Test Debugging**
```bash
# Run tests in debug mode
mvn test -Dmaven.surefire.debug

# Run single test with debug
mvn test -Dtest=AuthControllerTest -Dmaven.surefire.debug
```

### **Frontend Test Debugging**
```bash
# Run tests with verbose output
npm test -- --verbose

# Debug specific test
npm test -- --testNamePattern="AuthContext"

# Run tests with debugging
node --inspect-brk node_modules/.bin/react-scripts test --runInBand --no-cache
```

---

## 📋 **Testing Checklist**

### **Before Deployment**
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] API tests pass
- [ ] Coverage targets met
- [ ] No critical bugs
- [ ] Performance tests pass

### **Authentication Testing**
- [ ] Valid login for all roles
- [ ] Invalid credentials handled
- [ ] Token expiration works
- [ ] Logout functionality
- [ ] Protected routes secured

### **Role-Based Testing**
- [ ] Admin can access admin features
- [ ] Lecturer can access lecturer features
- [ ] Student can access student features
- [ ] Cross-role access denied
- [ ] Role-specific UI elements

### **CRUD Operations**
- [ ] Create operations work
- [ ] Read operations return data
- [ ] Update operations persist
- [ ] Delete operations remove data
- [ ] Validation errors handled

### **Error Handling**
- [ ] 401 Unauthorized responses
- [ ] 403 Forbidden responses
- [ ] 404 Not Found responses
- [ ] 400 Bad Request responses
- [ ] 500 Server Error handling

---

## 🎓 **Best Practices**

### **Writing Tests**
1. **Arrange, Act, Assert** pattern
2. **Descriptive test names**
3. **Test one thing at a time**
4. **Use meaningful assertions**
5. **Clean up after tests**

### **Test Data**
1. **Use test-specific data**
2. **Avoid hardcoded values**
3. **Reset data between tests**
4. **Use factories for objects**
5. **Mock external dependencies**

### **Test Maintenance**
1. **Keep tests up to date**
2. **Remove obsolete tests**
3. **Refactor test code**
4. **Document complex tests**
5. **Review test failures**

---

## 🔧 **Test Environment Setup**

### **Local Development**
```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d

# Run all tests
npm run test:all

# Generate coverage reports
npm run test:coverage
```

### **CI/CD Environment**
```bash
# Pull latest code
git pull origin main

# Run full test suite
./scripts/run-tests.sh

# Deploy if tests pass
./scripts/deploy.sh
```

---

## 📞 **Testing Support**

### **Resources**
- [Jest Documentation](https://jestjs.io/)
- [JUnit 5 Guide](https://junit.org/junit5/)
- [Postman Testing](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)

### **Getting Help**
- **Test Failures**: Check logs and error messages
- **Coverage Issues**: Review uncovered code paths
- **Performance**: Use profiling tools
- **CI/CD**: Check pipeline logs

**Remember**: Good tests make confident deployments! 🚀
