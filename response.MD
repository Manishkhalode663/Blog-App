         
**Project Overview**
- Full-stack MERN app with session-based auth and image uploads.
- Backend: `express` + `mongoose` + `passport-local` + `multer` + `sharp`.
- Frontend: React (Vite) with MUI, React Router, Axios clients using cookies.
- Development ports: backend on `5000`, frontend on `5173` with CORS allowing credentials.

**Backend**
- Server setup in `backend/src/app.js:22–49`: CORS configured for `http://localhost:5173` with `credentials:true`; session middleware and `passport` initialized; static serving for `uploads`; routes mounted at `/api/auth` and `/api/blogs`.
- Auth strategy in `backend/src/config/passport.js:6–28`: Local strategy authenticates by `email`, validates with `User.comparePassword`, serializes by `user.id`, deserializes to full user object.
- User model in `backend/src/models/User.js:4–10`: `username`, `email` unique, `password` hashed in a `pre('save')` hook (`backend/src/models/User.js:15–25`), `avatar` default URL.
- Blog model in `backend/src/models/Blog.js:3–12`: Core fields like `title`, `excerpt`, `content`, `image`, `category`, `author`, `authorAvatar`, `readTime`, timestamps.
- Image handling middleware in `backend/src/middleware/upload.js:24–38`: `multer` memory storage for `image` and `avatar`, file type filter for images; resized with `sharp` (`backend/src/middleware/upload.js:43–71` for blogs, `backend/src/middleware/upload.js:74–98` for avatars) and full URLs attached to `req.body`.
- Blog controller:
  - List with optional `limit` in `backend/src/controllers/blogController.js:4–18`.
  - Read one by `id` in `backend/src/controllers/blogController.js:20–29`.
  - Create with robust defaults for `image`/`authorAvatar` in `backend/src/controllers/blogController.js:33–73`.
- Auth controller:
  - Signup in `backend/src/controllers/authController.js:4–18` creates user then logs them in via `req.logIn`, returns user without password (`backend/src/controllers/authController.js:19–25`).
  - Login via `passport.authenticate('local')` (`backend/src/controllers/authController.js:26–41`), returns user sans password.
  - Logout via `req.logout` (`backend/src/controllers/authController.js:42–48`).
  - Current user in session (`backend/src/controllers/authController.js:50–59`).
  - Profile update reads `req.user.id`, applies fields (`backend/src/controllers/authController.js:60–86`).

**Frontend**
- App routing in `frontend/src/components/layouts/MainLayout.jsx:18–42`: Public pages plus `ProtectedRoute` wrapping `/profile` and `/create`.
- Auth context in `frontend/src/context/AuthContext.jsx:6–23`: On mount, calls `GET /api/auth/user` to hydrate user; exposes `login`, `signup`, `logout` (`frontend/src/context/AuthContext.jsx:25–44`).
- Protected routing in `frontend/src/components/ProtectedRoute.jsx:6–20`: Shows loading spinner while checking; redirects unauthenticated users to `/login`.
- Navbar in `frontend/src/components/Navbar.jsx:40–78`: Uses `useAuth`; menu shows user details and `Logout` action; navigates with `useNavigate`.
- Blogs listing in `frontend/src/pages/Blogs.jsx:55–81`: Fetches from `blogsApi.getAll`, maps shape when backend returns `{results, total}`.
- Single blog in `frontend/src/pages/SingleBlog.jsx:31–48`: Loads `/:id`, renders metadata, image, and content.
- Create blog in `frontend/src/pages/CreateBlog.jsx:85–106`: Submits `FormData` with `image`, `title`, etc.; injects `author` and `authorAvatar` from auth; navigates to `/blogs` on success.
- Profile page in `frontend/src/pages/ProfilePage.jsx:80–107`: Allows username and avatar update; calls `authApi.updateProfile(formData)` and refreshes the page.

**API Clients**
- Auth API base `http://localhost:5000/api` with cookies in `frontend/src/api/authApi.js:7–13`.
  - Endpoints used: `/auth/signup/`, `/auth/login/`, `/auth/logout/`, `/auth/user` (`frontend/src/api/authApi.js:18–69`).
  - Mismatch: `updateProfile` targets `PUT /me` (`frontend/src/api/authApi.js:75–83`), but backend expects `PUT /api/auth/user` (`backend/src/routes/authRoutes.js:13–17`).
  - Placeholder: `refreshToken` has no backend route (`frontend/src/api/authApi.js:55–63`).
- Blog API base `http://localhost:5000/api/blogs/` with cookies in `frontend/src/api/blogApi.js:7–13`.
  - `getAll` calls `/` (`frontend/src/api/blogApi.js:29–37`), `getById` calls `/${id}/` (`frontend/src/api/blogApi.js:39–47`), `create` `POST /` with `FormData` (`frontend/src/api/blogApi.js:50–58`).

**Key Findings**
- Route mismatch: `authApi.updateProfile` uses `PUT /me` but backend route is `PUT /api/auth/user`. This causes 404s on profile updates. Update the client to `PUT /auth/user`.
- No auth guard for profile update route. `upload.resizeAvatar` uses `req.user.id` (`backend/src/middleware/upload.js:77`); if unauthenticated, calling `PUT /api/auth/user` can throw. Consider adding a middleware that checks `req.isAuthenticated()` before allowing profile updates.
- Blog creation not server-protected. Frontend guards `/create`, but backend `POST /api/blogs/` is open; any client could post. Consider requiring authentication and reading author info from `req.user`.
- Security issues:
  - Hardcoded `session.secret` (`backend/src/app.js:35`). Move to env via `dotenv` and use a strong random string.
  - Mongo URL hardcoded (`backend/src/app.js:53`). Move to env and handle failures gracefully.
  - No payload validation/sanitization beyond very basic defaults in blog creation; add validation middleware.
- Consistency and cleanup:
  - `authApi.refreshToken` unused; either implement or remove for clarity.
  - `getFeaturedBlogs` sends `featured=true` but backend ignores; align or prune the param.
  - `dotenv` in dependencies but not loaded; consider `require('dotenv').config()` and using env vars.

**How It Works**
- Authentication:
  - User logs in with email/password; `passport-local` verifies (`backend/src/config/passport.js:6–28`), session stored, user deserialized on subsequent requests (`backend/src/config/passport.js:35–43`).
  - Frontend persists session by requesting `/api/auth/user` on app load and keeps cookies via `withCredentials:true` (`frontend/src/context/AuthContext.jsx:10–20`).
- Image uploads:
  - Frontend sends `multipart/form-data` with key `image`; `multer` captures file (`backend/src/middleware/upload.js:33–35`), `sharp` resizes and saves under `uploads/`, full URL added to `req.body.image` (`backend/src/middleware/upload.js:62–66`), served via `/uploads` static (`backend/src/app.js:45`).
- Data flow:
  - Blogs list returns `{results, total}` (`backend/src/controllers/blogController.js:10–13`), UI adapts shape (`frontend/src/pages/Blogs.jsx:65–74`).
  - Single blog read uses `/:id` (`backend/src/routes/blogRoutes.js:10`), displayed with hero image and meta.

**Recommended Fixes**
- Update profile API client:
  - Change `authApi.updateProfile` endpoint to `PUT /auth/user` to match backend. Reference mismatch: `frontend/src/api/authApi.js:75–83` vs `backend/src/routes/authRoutes.js:13–17`.
- Add auth guard server-side:
  - Create middleware using `req.isAuthenticated()` and apply to `PUT /api/auth/user` and `POST /api/blogs/`.
- Move secrets to env:
  - Load `dotenv` in `backend/src/app.js` and read `PORT`, `MONGO_URI`, `SESSION_SECRET`, `CORS_ORIGIN`.
- Validate inputs:
  - Add validation for blog fields and user updates; reject empty/invalid payloads.
- Remove unused/incorrect endpoints:
  - Drop `refreshToken` or implement a proper route; align `getFeaturedBlogs` param handling.

If you want, I can implement the small client-side fix for `updateProfile` and add a simple auth guard middleware on the backend in one pass, then run both apps to verify end-to-end.