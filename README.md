# 🚀 TaskFlow - Task Management System

A modern, full-stack **Task Management System** built with the **MERN Stack**. TaskFlow helps users organize, track, and manage their daily tasks efficiently through a clean, responsive, and intuitive interface.

---

## 📸 Preview

> Add screenshots of your application here.

### Login
![Login Screenshot](screenshots/login.png)

### Dashboard
![Dashboard Screenshot](screenshots/dashboard.png)

### My Tasks
![My Tasks Screenshot](screenshots/mytasks.png)

### Calendar
![Calendar Screenshot](screenshots/calendar.png)

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Logout

---

## ✅ Task Management

- Create Task
- View Tasks
- Edit Task
- Delete Task
- Search Tasks
- Filter by Status
- Filter by Priority
- Due Date Validation
- Responsive Task Cards

---

## 📅 Calendar

- Tasks grouped by:
  - Overdue
  - Today
  - Tomorrow
  - Upcoming

---

## 🎨 UI Features

- Modern SaaS UI
- Responsive Design
- Toast Notifications
- Loading States
- Empty States
- Error Handling
- Smooth Animations

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv

---

# 📂 Project Structure

```
TaskFlow/
│
├── taskflow-app/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── taskflow-backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
```

```
cd taskflow
```

---

## 2️⃣ Backend Setup

```
cd taskflow-backend
```

Install dependencies

```bash
npm install
```

Create

```
.env
```

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

CLIENT_URL=http://localhost:5173
```

Run backend

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```
cd taskflow-app
```

Install dependencies

```bash
npm install
```

Create

```
.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

---

# 🔗 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

---

## Tasks

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/tasks | Get All Tasks |
| POST | /api/tasks | Create Task |
| PUT | /api/tasks/:id | Update Task |
| DELETE | /api/tasks/:id | Delete Task |

---

# 📦 Environment Variables

Backend

```env
PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
```

Frontend

```env
VITE_API_URL=
```

---

# 🚀 Deployment

## Frontend

**Vercel**

## Backend

**Render**

## Database

**MongoDB Atlas**

---

# 🧪 Testing Checklist

- User Registration
- User Login
- JWT Authentication
- Create Task
- Update Task
- Delete Task
- Search
- Status Filter
- Priority Filter
- Calendar View
- Responsive Design
- Toast Notifications

---

# 📈 Future Improvements

- Drag & Drop Tasks
- Email Notifications
- Team Collaboration
- Task Labels
- File Attachments
- Dark Mode
- Recurring Tasks

---

# 👨‍💻 Author

**AL ZAYAN P**

MERN Stack Developer

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_LINKEDIN

Portfolio: https://alzayan-portfolio.vercel.app

---

# 📄 License

This project is created for educational purposes and internship assessment.

---

## ⭐ If you like this project, consider giving it a star on GitHub!