# MERN Taskboard

A full-stack task manager: MongoDB, Express, React (Vite), Node.
Features: register/login (JWT), per-user tasks, create / complete / edit / delete, filter by status.

## Run locally
Prerequisites: Node 18+, and MongoDB (local or a free MongoDB Atlas cluster).

```bash
# 1. API
cd server
cp .env.example .env     # set MONGO_URI and JWT_SECRET
npm install
npm run dev              # http://localhost:5000

# 2. Client (new terminal)
cd client
npm install
npm run dev              # http://localhost:5173
```
The Vite dev server proxies `/api` to port 5000, so no CORS setup is needed in development.

## API
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | no | create account, returns token |
| POST | /api/auth/login | no | returns token |
| GET | /api/tasks | yes | list your tasks (`?status=open\|done`) |
| POST | /api/tasks | yes | create task |
| PUT | /api/tasks/:id | yes | update task |
| DELETE | /api/tasks/:id | yes | delete task |

## Structure
```
server/  server.js, models/, middleware/auth.js, routes/
client/  src/App.jsx, api.js, components
```
