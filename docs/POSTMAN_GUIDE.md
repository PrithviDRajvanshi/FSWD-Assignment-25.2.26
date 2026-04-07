# Postman Guide

## Overview

This project includes a Postman collection named `Creator's Platform API` and a Postman environment named `Local Development` for manually testing the backend API.

The exported files are:

- `docs/creators-platform-api.postman_collection.json`
- `docs/local-development.postman_environment.json`

## Setup Instructions

1. Start the backend server locally.
2. Confirm the API is available at `http://localhost:5000` or update the environment value if your server uses a different port.
3. Open the Postman desktop application.

## Import the Collection

1. In Postman, click `Import`.
2. Choose `Upload Files`.
3. Select `docs/creators-platform-api.postman_collection.json`.
4. Import the collection.

## Import the Environment

1. In Postman, click `Import`.
2. Choose `Upload Files`.
3. Select `docs/local-development.postman_environment.json`.
4. Import the environment.
5. Select the `Local Development` environment from the environment dropdown in Postman.

## Variables

- `baseURL`: Base URL for the local API. All request URLs use `{{baseURL}}`.
- `authToken`: JWT token saved automatically after a successful login.
- `postId`: Post ID saved automatically after creating a post, then reused for update and delete requests.
- `userEmail`: Email used for login after registration.
- `userPassword`: Password used for login after registration.
- `userName`: Name used for registration.
- `userId`: User ID saved from the login response.

## Collection Structure

The collection is organized into these folders:

- `Health`
- `Auth`
- `Posts`

This keeps requests grouped by purpose and makes the collection easier to navigate, demo, and maintain.

## Request Order

Run the requests in this order for the smoothest local test flow:

1. `Health > Health Check`
2. `Auth > Register User`
3. `Auth > Login User`
4. `Posts > Get All Posts`
5. `Posts > Create Post`
6. `Posts > Update Post`
7. `Posts > Delete Post`

## Automatic Variable Saving

The collection includes Postman test scripts that automatically save values into environment variables:

- `Register User` saves the submitted user details for reuse.
- `Login User` saves the JWT token to `{{authToken}}` and the current user ID to `{{userId}}`.
- `Create Post` saves the created post ID to `{{postId}}`.
- `Delete Post` clears `{{postId}}` after a successful deletion.

## Test Assertions Included

Basic Postman tests are included on multiple requests. These checks cover:

- HTTP status codes
- Expected response fields
- Authentication token presence
- Success flags and response messages
- Pagination object presence on the posts listing route

Examples:

- `Health Check` verifies `200 OK`, `success`, `message`, and `timestamp`.
- `Login User` verifies `200 OK`, confirms a `token` exists, and stores it automatically.
- `Create Post` verifies `201 Created`, checks the success message, and stores the post ID.

## Notes About the API Routes

This codebase exposes registration and login routes under:

- `POST /api/users/register`
- `POST /api/users/login`

The assignment text references auth routes in a generic way, but the collection matches the actual Express routes implemented in this repository.

Also, `GET /api/posts` is public in the backend code, but the request still includes `Authorization: Bearer {{authToken}}` to satisfy the assignment requirement that authenticated requests use the token variable.
