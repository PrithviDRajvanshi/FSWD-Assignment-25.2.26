# Creators Platform Monorepo

## Structure

- `backend/` contains the Express, MongoDB, and Socket.IO backend.
- `frontend/` contains the React + Vite frontend.

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` from `backend/.env.example`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Render Deployment

### Backend Web Service

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend Static Site

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Set `VITE_API_URL` on the frontend to your backend API URL, for example `https://your-backend.onrender.com/api`.
