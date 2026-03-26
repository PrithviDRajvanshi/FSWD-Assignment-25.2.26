# Pull Request: Authentication Integration Tests

## Description

This PR adds automated integration testing for the authentication API using Jest and Supertest. The goal is to replace manual Postman-only verification with repeatable backend tests that catch regressions whenever the auth code changes.

The implementation includes:
- Jest and Supertest test setup through `npm test`
- Express app/server separation so tests can import the app without starting the HTTP listener
- Dedicated auth routes at `/api/auth/register` and `/api/auth/login`
- Test database support using `MONGODB_URI_TEST`
- Integration tests for both success and failure scenarios
- Lifecycle hooks for database setup, cleanup, and teardown

## Branch

- Feature Branch: `feature/auth-integration-tests`
- Target Branch: `main`

## Changes Made

### 1. Server Refactor

- Created `app.js` to hold Express configuration, middleware, routes, and error handling
- Updated `server.js` to import `app` and only start listening after the database connects
- Kept Socket.IO initialization in `server.js` so tests stay focused on the Express app

### 2. Authentication Route Structure

- Added `routes/authRoutes.js`
- Mounted auth endpoints under `/api/auth`
- Preserved existing user routes so the rest of the app is not broken by the refactor

### 3. Test Database Support

- Added support for `MONGODB_URI_TEST`
- Updated database configuration to choose the test database when `NODE_ENV=test`
- Added reusable database helpers for:
  - connect
  - clear data
  - disconnect

### 4. Integration Tests

Created `tests/auth.test.js` with the required scenarios:

#### POST `/api/auth/register`
- Registers a user with valid data
- Rejects registration when email already exists
- Rejects registration when required fields are missing

#### POST `/api/auth/login`
- Logs in successfully with correct credentials
- Rejects login when the password is incorrect

### 5. Lifecycle Hooks

Implemented test lifecycle hooks:
- `beforeAll` connects to the test database
- `afterEach` clears test data
- `afterAll` closes the database connection

This keeps tests isolated, prevents hanging processes, and ensures stable repeated test runs.

## Files to Review

- `app.js`
- `server.js`
- `config/db.js`
- `routes/authRoutes.js`
- `tests/auth.test.js`
- `.env`
- `package.json`

## How to Test

1. Ensure MongoDB is running locally
2. Confirm `.env` contains:

```env
MONGO_URI=mongodb://localhost:27017/creators-platform
MONGODB_URI_TEST=mongodb://localhost:27017/creators-platform-test
```

3. Run:

```bash
npm test
```

## Passing Test Output

```bash
> fswd-25.2.26@1.0.0 test
> jest --runInBand

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.867 s
Ran all test suites.
```

## Why This Refactor Matters

- `app.js` can be imported directly into Jest/Supertest without opening a network port
- `server.js` stays responsible for runtime-only concerns like listening and Socket.IO
- A separate test database prevents automated tests from polluting development data
- Lifecycle hooks keep the suite fast, isolated, and reliable

## Video Talking Points

For the 3-4 minute explanation video, cover:
- Why `app.js` and `server.js` were separated
- How `tests/auth.test.js` is structured
- What one auth test case verifies
- Why `beforeAll`, `afterEach`, and `afterAll` matter
- How automated testing improves backend reliability and regression detection

## Checklist

- [x] Jest installed and configured
- [x] Supertest installed and configured
- [x] `npm test` script added
- [x] `testEnvironment: "node"` configured
- [x] `app.js` exports the Express app
- [x] `server.js` starts the server separately
- [x] Test database configuration added
- [x] Required auth integration tests implemented
- [x] Lifecycle hooks implemented
- [x] Tests pass successfully
- [ ] PR opened on GitHub
- [ ] Explanation video recorded and linked

## Notes for Reviewers

- Tests are integration-focused and hit the real Express routes with Supertest
- The suite uses the MongoDB test database, not the development database
- The current implementation keeps the existing `/api/users` routes while also exposing assignment-aligned `/api/auth` endpoints
