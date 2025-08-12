# Project Management Backend

Backend API for a Project Management tool built with **Express**, **TypeScript**, **Mongoose**, and **MongoDB**.

## scripts

Running the Project
npm run dev (development)
npm run start (production without reload)

To quickly populate your database with dummy data (one user, two projects, three tasks each):

npm run seed


---

## Features

- JWT-based user authentication (register/login/logout/verify)  
- CRUD operations for projects and tasks  
- Tasks are linked to projects and support status filtering  
- Password hashing with bcrypt  
- Secure cookie management  
- Validation with Zod schemas  

---

## API Routes

### User Authentication

| Method | Route           | Description                 | Middleware          |
| ------ | --------------- | ---------------------------|---------------------|
| POST   | `/register-user`| Register new user           | `validateRegistration`|
| POST   | `/login-user`   | Login user, returns JWT     | None                |
| POST   | `/logout-user`  | Logout user, clears cookies | `verifyJWT`         |
| GET    | `/verify-login` | Verify JWT and get user info| `verifyJWT`         |

---

### Projects

| Method | Route                      | Description                        | Middleware   |
| ------ | -------------------------- | ---------------------------------|--------------|
| POST   | `/create-project`          | Create a new project              | `verifyJWT`  |
| GET    | `/projects`                | Get all projects of logged user  | `verifyJWT`  |
| GET    | `/get-project/:projectId`  | Get single project by ID          | `verifyJWT`  |
| PATCH  | `/update-project/:projectId`| Update project details          | `verifyJWT`  |
| DELETE | `/delete-project/:projectId`| Delete a project by ID          | `verifyJWT`  |

---

### Tasks

| Method | Route                     | Description                        | Middleware   |
| ------ | ------------------------- | ---------------------------------|--------------|
| POST   | `/create-task/:projectId` | Create a task under a project     | `verifyJWT`  |
| GET    | `/tasks/:projectId`        | Get all tasks under a project     | `verifyJWT`  |
| PATCH  | `/update-task/:projectId`  | Update a task by ID               | `verifyJWT`  |
| DELETE | `/delete-task/:taskId`     | Delete a task by ID               | `verifyJWT`  |

---


### Prerequisites

- Node.js 
- npm or yarn  
- MongoDB instance (local or cloud like MongoDB Atlas)  

### Environment Variables

Create a `.env` file at the project root with:

```env
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_access_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
PORT=3000
CORS_ORIGIN=http://localhost:5173
