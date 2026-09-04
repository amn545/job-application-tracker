# Job Application Tracker

MERN stack app to track job applications during placement season — auth, CRUD, and a status
breakdown dashboard.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt password hashing
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Axios

## How it works (samjhane ke liye)
1. User register/login karta hai → backend password ko hash karke store karta hai, aur ek JWT token
   deta hai.
2. Token frontend `localStorage` mein save hota hai aur har request ke saath Authorization header
   mein bhejta hai (`src/api/axios.js` ka interceptor ye automatically karta hai).
3. Backend ka `authMiddleware` (`middleware/auth.js`) har protected route pe token verify karta hai.
4. Applications sirf `user: req.userId` filter ke saath fetch/update/delete hoti hain — isse ek user
   dusre ka data nahi chhed sakta.
5. `/stats/summary` route MongoDB aggregation (`$group`) se status-wise count nikalta hai, jo
   dashboard mein pie chart banata hai.

## Local setup
```bash
# Backend
cd backend
npm install
cp .env.example .env   # MONGO_URI aur JWT_SECRET bharo
npm run dev

# Frontend (naye terminal mein)
cd frontend
npm install
cp .env.example .env   # backend deploy hone ke baad URL yahan daalo
npm run dev
```

## Deploy today (sab free tier)

1. **MongoDB Atlas** (database) — mongodb.com/atlas pe free cluster banao, connection string copy karo.
2. **Backend → Render.com** — GitHub repo connect karo, root directory `backend` set karo,
   build command `npm install`, start command `npm start`. Environment variables mein
   `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` daalo.
3. **Frontend → Vercel.com** — GitHub repo connect karo, root directory `frontend` set karo.
   Environment variable `VITE_API_URL` mein Render wala backend URL + `/api` daalo
   (e.g. `https://your-app.onrender.com/api`).
4. Render backend ka `CLIENT_URL` env variable update karo Vercel wale URL se (CORS ke liye).

## Possible extensions (agar interview mein "aur kya add karoge" poochein)
- Resume upload per application
- Email reminder for follow-ups (node-cron + nodemailer)
- Kanban drag-and-drop (react-beautiful-dnd) instead of dropdown status change
