# CORS and Vite Proxy Implementation Guide

## Overview
This implementation demonstrates proper frontend-backend communication in a full-stack application by configuring:
1. **Backend CORS** - Express server accepts requests only from the configured frontend URL
2. **Vite Proxy** - Development server proxies API calls to the backend
3. **Connectivity Test** - Component to verify frontend-backend communication is working

## Why CORS Matters

### The Problem: Same-Origin Policy

The browser's Same-Origin Policy blocks direct communication between:
- **Frontend**: `http://localhost:5173` (React + Vite)
- **Backend**: `http://localhost:5000` (Express API)

Even though both run locally, they're on different ports and considered different "origins." A request from the frontend to the backend would be blocked by the browser with a CORS error.

### The Solution: CORS Configuration

**CORS (Cross-Origin Resource Sharing)** allows servers to specify which external origins can access their resources.

## Implementation Details

### 1. Backend CORS Configuration

**File**: `server.js`

```javascript
const cors = require("cors");

const corsOptions = {
    origin: process.env.CLIENT_URL,  // Only allow frontend URL
    credentials: true,                // Allow cookies/auth headers
    optionsSuccessStatus: 200         // For older browsers
};

app.use(cors(corsOptions));
```

**Key Points:**
- `origin`: Uses environment variable `CLIENT_URL` for flexibility (can change per environment)
- `credentials: true`: Allows authentication tokens and cookies to be sent
- Environment variable makes this production-ready (different URLs for dev/staging/production)

**Environment Variable (.env)**:
```
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 2. Vite Proxy Configuration

**File**: `client/vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

**How It Works:**
- Any request to `/api/*` is proxied to `http://localhost:5000/api/*`
- `changeOrigin: true` modifies the `Host` header to match the target
- **Development benefit**: Frontend code doesn't need to know where the backend is
- **Production note**: Build output is separate; CORS is still needed for production deployments

### 3. Frontend API Communication

**How to use in components:**

```javascript
// Use relative paths starting with /api
fetch('/api/connection-test')
  .then(res => res.json())
  .then(data => console.log(data))
```

**Why this works:**
1. Vite dev server intercepts the request
2. Proxy forwards it to `http://localhost:5000/api/connection-test`
3. Backend responds
4. No CORS error because Vite acts as intermediary

### 4. Backend Connection Test Endpoint

**File**: `server.js`

```javascript
app.get("/api/connection-test", (req, res) => {
    res.json({
        success: true,
        message: "Frontend-Backend connection is working!",
        timestamp: new Date().toISOString(),
        serverPort: PORT,
        clientUrl: process.env.CLIENT_URL
    });
});
```

### 5. ConnectionTest Component

**File**: `client/src/components/common/ConnectionTest.jsx`

The component:
- Makes a fetch request to `/api/connection-test` on mount
- Displays loading state while waiting
- Shows success message and response data on success
- Shows error message and details on failure
- Includes a retry button for manual testing

## How to Run & Test

### Prerequisites
- Node.js installed
- npm packages installed in both root and client directories

### Step 1: Install Dependencies

```bash
# Backend dependencies (from project root)
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Start Backend Server

```bash
# From project root
npm run dev
# Should output: "Server running on port 5000"
```

### Step 3: Start Frontend Server (in a new terminal)

```bash
# From project root
cd client
npm run dev
# Should output: "VITE v7.3.1 ready in ... Local: http://localhost:5173/"
```

### Step 4: Test the Connection

1. Open browser and go to: `http://localhost:5173/connection-test`
2. If working correctly, you should see:
   - ✅ Success message
   - Response data showing server information
3. Click "Retry Connection" button to test multiple times

### Verify No CORS Errors

**Check Browser Console** (F12):
- Should NOT see any CORS errors
- Should see successful fetch in Network tab
- Request should go to `http://localhost:5173/api/connection-test`
- Response should come from backend

## Production Considerations

### Vite Proxy is Development-Only
- The proxy only works during `npm run dev`
- Production builds (`npm run build`) create static files
- For production, use proper CORS configuration

### Production Deployment
1. **Frontend**: Built files are served by a web server (Nginx, Apache, etc.)
2. **Backend**: API runs on a separate server/port
3. **CORS**: Backend CORS configuration is what actually allows communication
4. **Update CLIENT_URL**: Change environment variable for production URL

Example production CORS:
```javascript
const corsOptions = {
    origin: process.env.CLIENT_URL, // e.g., "https://myapp.com"
    credentials: true,
    optionsSuccessStatus: 200
};
```

## Troubleshooting

### CORS Error in Browser
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Ensure CLIENT_URL in `.env` matches your frontend URL exactly

### Connection Refused Error
- Backend not running? Start it with `npm run dev`
- Wrong port? Check PORT in `.env`
- Firewall issue? Ensure port 5000 is not blocked

### Proxy Not Working
- Make sure you're running `npm run dev` (not `npm run build`)
- Check vite.config.js is properly configured
- Restart dev server after changing vite.config.js

## Architecture Diagram

```
DEVELOPMENT:
┌─────────────────┐              ┌──────────────────┐
│  React App      │              │  Express Server  │
│  :5173          │──────────────→│  :5000           │
│  (frontend)     │ /api requests │  (backend API)   │
└─────────────────┘   [proxied]   └──────────────────┘
       ↓
  Vite Dev Server
  [Proxy middleware]
       ↓
  Intercepts /api requests
  Forwards to :5000

PRODUCTION:
┌─────────────────┐              ┌──────────────────┐
│  HTML/JS/CSS    │              │  Express Server  │
│  myapp.com      │──────────────→│  api.myapp.com   │
│  (static files) │ /api requests │  (backend API)   │
└─────────────────┘   [CORS req]  └──────────────────┘
```

## Key Takeaways

1. **CORS is essential** for browser security but needs proper configuration
2. **Vite proxy simplifies development** by handling CORS transparently
3. **Environment variables** make configuration flexible across environments
4. **Both CORS + proxy work together** - proxy for dev, CORS for production
5. **Never hardcode URLs** - use environment variables for deployment flexibility

## Files Modified

- `server.js` - Added CORS configuration and connection test endpoint
- `client/vite.config.js` - Added proxy configuration
- `config/db.js` - Made MongoDB connection optional for testing
- `client/src/App.jsx` - Added connection test route
- `client/src/components/common/ConnectionTest.jsx` - New component
- `client/src/components/common/ConnectionTest.css` - Styling
- `.env` - Added CLIENT_URL variable

## Next Steps

1. Test the connection using the provided component
2. Use relative `/api` paths in your components for API calls
3. For production, update `.env` with your production URLs
4. Review the response data from the connection test endpoint
5. Implement error handling in your components as needed
