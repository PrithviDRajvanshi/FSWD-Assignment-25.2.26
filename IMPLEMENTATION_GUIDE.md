# CRUD with Pagination - Implementation Guide

## Overview
This document provides a comprehensive guide to the CRUD Create-Read with Pagination feature implementation for the Creator's Platform.

---

## 1. Backend Implementation

### 1.1 Data Model - Post Schema

**File:** `models/Post.js`

The Post model represents the core content for the platform with the following fields:

```javascript
{
  title: String (required, min 3 chars),
  description: String (required, min 10 chars),
  content: String (required),
  author: ObjectId ref to User (required),
  likes: Number (default: 0),
  tags: [String],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Key Features:**
- Author reference links posts to authenticated users
- Timestamps track creation and modification
- Tags for content categorization
- Likes counter for engagement tracking

---

### 1.2 API Endpoints

**Base URL:** `/api/posts`

#### Create Post (Protected)
```
POST /api/posts
Headers: Authorization: Bearer <token>
Body: {
  title: string,
  description: string,
  content: string,
  tags: [string] (optional)
}
Response: {
  success: true,
  message: "Post created successfully",
  data: { Post object }
}
```

#### Get All Posts (Public - Paginated)
```
GET /api/posts?page=1&limit=10
Response: {
  success: true,
  data: [Post objects],
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalPosts: 50,
    postsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

#### Get User's Posts (Protected - Paginated)
```
GET /api/posts/user/my-posts?page=1&limit=10
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: [User's Post objects],
  pagination: { pagination metadata }
}
```

#### Get Single Post (Public)
```
GET /api/posts/:id
Response: {
  success: true,
  data: { Post object }
}
```

#### Update Post (Protected)
```
PUT /api/posts/:id
Headers: Authorization: Bearer <token>
Body: {
  title?: string,
  description?: string,
  content?: string,
  tags?: [string]
}
```

#### Delete Post (Protected)
```
DELETE /api/posts/:id
Headers: Authorization: Bearer <token>
```

---

### 1.3 Pagination Logic

The backend implements cursor-based pagination with the following parameters:

- **page**: Current page number (default: 1)
- **limit**: Number of posts per page (default: 10)
- **skip**: Calculated as `(page - 1) * limit`

**Response includes:**
- `currentPage`: The current page being viewed
- `totalPages`: Total number of pages available
- `totalPosts`: Total number of posts in the database
- `postsPerPage`: Number of posts per page
- `hasNextPage`: Boolean indicating if a next page exists
- `hasPrevPage`: Boolean indicating if a previous page exists

---

### 1.4 Authentication & Authorization

**Protection Middleware:** `/middleware/authMiddleware.js`

- JWT token extracted from `Authorization: Bearer <token>` header
- Token verified and user ID attached to `req.user`
- Protected routes validate token before processing

**Authorization Rules:**
- Create: Only authenticated users can create posts
- Read: Public can read all posts, authenticated users can filter their own
- Update: Only post author can update
- Delete: Only post author can delete

---

## 2. Frontend Implementation

### 2.1 Components Architecture

#### CreatePost Page (`pages/CreatePost.jsx`)
- Form with title, description, content, and tags fields
- Input validation (required fields, minimum lengths)
- Error state handling
- Success message with redirect to dashboard
- Loading state during submission

**Features:**
- Validates all required fields before submission
- Splits comma-separated tags into array
- Provides user feedback on success/error
- Auto-redirects to dashboard after successful creation

#### Dashboard Page (`pages/Dashboard.jsx`)
- Displays user information header
- Lists user's posts with pagination
- Shows post count and pagination info
- Handles loading and empty states
- Quick navigation to CreatePost

**Key States:**
- `posts`: Array of user's posts
- `pagination`: Pagination metadata
- `postsLoading`: Loading indicator
- `error`: Error message display

#### PostCard Component (`components/PostCard.jsx`)
- Displays individual post information
- Shows author name and creation date
- Displays post description and preview
- Shows tags with styling
- Displays likes count

#### Pagination Component (`components/Pagination.jsx`)
- Smart page button rendering
- Previous/Next navigation buttons
- Direct page selection
- Ellipsis for large page ranges
- Disabled state for boundary pages

---

### 2.2 State Management

**Using React Hooks:**
- `useState`: Managing local component state
- `useEffect`: Fetching data on mount/dependency change
- `useNavigate`: Client-side routing
- `useAuth`: Custom hook for authentication context

**Data Flow:**
1. User logs in → AuthContext stores token
2. User navigates to Dashboard → Fetches user's posts
3. User creates post → Form submits to `/api/posts`
4. User clicks pagination → Fetches new page of posts
5. Posts display with pagination controls

---

### 2.3 Error Handling

**Loading States:**
```javascript
if (postsLoading) {
  return <div>Loading your posts...</div>;
}
```

**Empty States:**
```javascript
if (posts.length === 0) {
  return (
    <div>
      You haven't created any posts yet.
      <button>Create Your First Post</button>
    </div>
  );
}
```

**Error States:**
```javascript
if (error) {
  return <div className="alert alert-error">{error}</div>;
}
```

---

### 2.4 API Integration

**Base Configuration:** `utils/api.js`
- Axios instance with default baseURL `/api`
- JWT token interceptor on all requests
- Response interceptor for error handling

**Usage in Components:**
```javascript
const response = await api.get('/posts/user/my-posts?page=1&limit=10');
const response = await api.post('/posts', { title, description, content, tags });
```

---

## 3. User-Specific Data Display

### Implementation:
1. **Backend Route:** `GET /api/posts/user/my-posts` filters by `author: req.user.id`
2. **Frontend Fetch:** Dashboard calls this protected endpoint
3. **Pagination:** Each page shows only the current user's posts

### Benefits:
- Users see only their own content
- Efficient database queries with user filtering
- Privacy-respecting data access
- Scalable pagination for large datasets

---

## 4. Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| Post Creation | ✅ Complete | Authenticated users can create posts with validation |
| Post Reading | ✅ Complete | Public can read all posts, users see their own |
| Pagination | ✅ Complete | Page/limit parameters, metadata in response |
| Authentication | ✅ Complete | JWT-based protection on create/update/delete |
| User Filtering | ✅ Complete | Posts automatically linked to logged-in user |
| Error Handling | ✅ Complete | Loading, error, and empty states implemented |
| Responsive Design | ✅ Complete | Mobile-friendly layouts for all components |

---

## 5. Testing the Implementation

### 1. Sign Up/Login
```
1. Navigate to /register
2. Create a new account
3. Navigate to /login and authenticate
```

### 2. Create a Post
```
1. Click "Create Post" in navigation
2. Fill in title, description, and content
3. Add optional tags (comma-separated)
4. Click "Create Post"
5. Should redirect to dashboard
```

### 3. View Dashboard
```
1. Navigate to /dashboard
2. See your user info
3. See your created posts
4. If more than 10 posts, pagination controls appear
```

### 4. Test Pagination
```
1. Create multiple posts (more than 10)
2. View pagination controls
3. Click Next/Previous buttons
4. Click specific page numbers
5. Observe correct posts loading
```

### 5. Test Error Handling
```
1. Create post with incomplete data (error shown)
2. Logout and try to create post (redirected to login)
3. Navigate to dashboard without auth (redirected to login)
```

---

## 6. Database Schema

### Post Collection:
```
{
  _id: ObjectId,
  title: String,
  description: String,
  content: String,
  author: ObjectId (ref: User),
  likes: Number,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes (recommended):
- `{ author: 1, createdAt: -1 }` - For efficient user post queries
- `{ createdAt: -1 }` - For sorting all posts by date

---

## 7. Commit Information

**Branch:** `feature/crud-create-read-pagination`

**Commit Hash:** `08856df`

**Files Changed:** 14 files
- 8 new files created
- 4 existing files modified
- 1,302 lines added

**Key Files:**
- Backend: `models/Post.js`, `controllers/postController.js`, `routes/postRoutes.js`
- Frontend: `pages/CreatePost.jsx`, `pages/CreatePost.css`
- Frontend: `components/PostCard.jsx`, `components/PostCard.css`
- Frontend: `components/Pagination.jsx`, `components/Pagination.css`
- Frontend: `pages/Dashboard.jsx`, `pages/Dashboard.css`

---

## 8. Environment Setup

Ensure you have:
1. Node.js and npm installed
2. MongoDB connection configured (MONGO_URI in .env)
3. JWT_SECRET configured in .env
4. CLIENT_URL configured for CORS
5. API baseURL properly set to `/api` for Vite proxy

---

## 9. Next Steps / Future Enhancements

- [ ] Add post search functionality
- [ ] Implement post editing UI
- [ ] Add post deletion with confirmation
- [ ] Like/unlike posts feature
- [ ] Comment system on posts
- [ ] Post categories/filtering
- [ ] Social sharing features
- [ ] Analytics dashboard

---

## 10. Troubleshooting

### Issue: "Not authorized, token missing"
- **Solution:** Ensure you're logged in and token is stored in localStorage

### Issue: Posts not appearing in dashboard
- **Solution:** Check browser console for errors, verify MongoDB connection

### Issue: Pagination buttons not showing
- **Solution:** Create more than 10 posts to trigger pagination

### Issue: CORS errors
- **Solution:** Verify CLIENT_URL in .env matches your frontend URL

---

## Repository Links

- **GitHub Repository:** https://github.com/PrithviDRajvanshi/FSWD-Assignment-25.2.26
- **Feature Branch:** https://github.com/PrithviDRajvanshi/FSWD-Assignment-25.2.26/tree/feature/crud-create-read-pagination
- **Pull Request:** [Create PR from feature branch to main]

---

## Contact & Support

For questions or issues regarding this implementation, please refer to the PR description or create an issue in the repository.

---

**Last Updated:** March 9, 2026
**Implementation Status:** ✅ Complete
