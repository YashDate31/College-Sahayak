# 🎓 College Sahayak — Full-Stack Academic & AI Web Platform

> **Official MSBTE Diploma & Engineering Academic Ecosystem, AI Counselor (College Mitra), Curriculum Repository & Enterprise Web Infrastructure.**

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)](https://github.com/YashDate31/College-Sahayak)
[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel%20Live-blue?style=for-the-badge&logo=vercel)](https://college-sahayak.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-Render%20Live-informational?style=for-the-badge&logo=render)](https://college-sahayak.onrender.com)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-emerald?style=for-the-badge&logo=supabase)](https://supabase.com)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Groq%20LLaMA%203.3%2070B-orange?style=for-the-badge&logo=meta)](https://groq.com)
[![Developer](https://img.shields.io/badge/Solo%20Developer-Yash%20Date-purple?style=for-the-badge&logo=person)](https://github.com/YashDate31)

---

## 🧑‍💻 Solo Developer & Individual Project Notice

> [!IMPORTANT]
> **This entire ecosystem — including full-stack frontend architecture, REST API backend, database schema, AI chatbot integration, email dispatch system, data analytics dashboard, and deployment pipelines — was designed, developed, deployed, and maintained individually by Yash Date.**

* **Developer Name:** **Yash Vijay Date**
* **Enrollment Number:** `24210270230`
* **Institute:** Government Polytechnic Awasari (Khurd)
* **Department:** Computer Engineering
* **Industry Partner:** Somayu Infotech (Mentor: Mr. Yuvraj Hande Sir)
* **Academic Leadership:** HOD Mrs. Megha Yawalkar Mam | Principal Mr. Vitthal Bandal Sir
* **Internship Period:** 25th May 2026 to 23rd August 2026 (12 Weeks)

---

## 📊 Current Build & Deployment Status

This table represents the actual production build status, verified live across all production environments.

| Subsystem / Track | Primary Tech Stack | Owner / Lead | Live Status & Deployment |
| :--- | :--- | :--- | :--- |
| **Frontend Storefront** | React 19 + TypeScript + Vite + Vanilla CSS | **Yash Date** | 🟢 **Deployed Live on Vercel** ([Live App](https://college-sahayak.vercel.app)) |
| **Backend REST API** | Node.js + Express 5 + JWT + Bcrypt | **Yash Date** | 🟢 **Deployed Live on Render** ([Live API](https://college-sahayak.onrender.com)) |
| **Database & Auth** | Supabase (PostgreSQL) + RLS Policies | **Yash Date** | 🟢 **Configured & Verified in Production** |
| **AI Counselor Engine** | Groq LLaMA 3.3 70B + Gemini 2.0 Flash Fallback | **Yash Date** | 🟢 **Serving Live Queries (0% Static Fallbacks)** |
| **Email Dispatcher** | Brevo REST API + Gmail SMTP Multi-Tier | **Yash Date** | 🟢 **Verified & Delivering OTPs** |

### 🔗 Live Production Endpoints:
* 🌐 **Frontend Web App:** [https://college-sahayak.vercel.app](https://college-sahayak.vercel.app)
* ⚙️ **Backend REST API:** [https://college-sahayak.onrender.com](https://college-sahayak.onrender.com)

---

## 🏗️ Architecture & Data Flow

### High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client["💻 Frontend Layer (Vercel)"]
        UI["React 19 + TypeScript SPA"]
        Router["React Router v7"]
        State["Client State & JWT Token Storage"]
        UI --> Router
        Router --> State
    end

    subgraph API["⚙️ Backend REST API (Render)"]
        Server["Node.js + Express 5 Server"]
        AuthMiddleware["JWT Authentication & Admin Middleware"]
        RouteChat["/api/chat Engine"]
        RouteMaterials["/api/materials Pipeline"]
        RouteAuth["/api/auth Dispatcher"]

        Server --> AuthMiddleware
        AuthMiddleware --> RouteChat
        AuthMiddleware --> RouteMaterials
        AuthMiddleware --> RouteAuth
    end

    subgraph Database["🗄️ Database Layer (Supabase)"]
        Postgres[(Supabase PostgreSQL)]
        TableUsers[("users Table")]
        TableMaterials[("materials Table")]
        TableOTPs[("otps Table")]

        Postgres --- TableUsers
        Postgres --- TableMaterials
        Postgres --- TableOTPs
    end

    subgraph AI["🤖 External AI Engine"]
        Groq["Groq API (LLaMA 3.3 70B Versatile)"]
        Gemini["Google Gemini 2.0 Flash Fallback"]
    end

    subgraph Mailer["✉️ Email Infrastructure"]
        Brevo["Brevo REST API (v3/smtp/email)"]
        Gmail["Nodemailer Gmail SMTP Fallback"]
    end

    Client -->|HTTPS REST Calls| Server
    RouteAuth -->|CRUD Query| Postgres
    RouteMaterials -->|Filtered Material Query| Postgres
    RouteChat -->|Generative Prompt| Groq
    Groq -.->|Fallback if Busy| Gemini
    RouteAuth -->|Send OTP/Verification| Brevo
    Brevo -.->|Fallback if 401/429| Gmail
```

### Plain-English Architecture Explanation
1. **Frontend-First SPA:** The user interacts with a responsive React 19 single-page application built with Vite and TypeScript.
2. **Stateless API & Role-Based Auth:** Authentication is managed using custom JWT tokens generated upon secure password verification (`bcryptjs`). Requests carry bearer tokens evaluated by express middlewares.
3. **Resilient AI Pipeline:** When a user queries **College Mitra**, the backend calls **Groq's LLaMA 3.3 70B** model. If rate limits occur, it seamlessly fails over to **Google Gemini 2.0 Flash**, ensuring zero downtime or static generic error text.
4. **User Material Isolation:** Student uploads are tagged with `[PENDING][by:user_email]` titles. The backend isolates uploads so users only see their own pending materials, while the Admin Dashboard features a full moderation and approval queue.
5. **Multi-Tier Email Fallback:** Account verification emails attempt delivery via Brevo REST API v3. If the primary key is rate-limited or unconfigured, the system automatically engages Gmail SMTP (`nodemailer`) and logs emergency OTPs to the console.

---

## 📁 Repository & Project Structure

```text
College-Sahayak/
├── backend/                          # Node.js + Express REST API
│   ├── config/                       # Supabase client & environment configuration
│   ├── middleware/                   # Auth & admin JWT validation middlewares
│   ├── routes/                       # API Route Handlers
│   │   ├── auth.js                   # Signup, Login, OTP verification, Reset Password, Admin role
│   │   ├── chat.js                   # Groq LLaMA 3.3 70B & Gemini AI Integration
│   │   ├── materials.js              # Material upload, moderation, user isolation, approval
│   │   └── users.js                  # Profile & user stats management
│   ├── utils/                        # Helper utilities (sendEmail dispatcher)
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Express server bootstrap & middleware pipeline
│
└── frontend/                         # React 19 + TypeScript Single Page Application
    ├── public/                       # Static assets & favicon
    ├── src/                          # Application Source
    │   ├── components/               # Reusable UI Components (Navbar, Footer, Chatbot, UploadModal)
    │   ├── pages/                # Page Views
    │   │   ├── Home.tsx              # Landing Hero, Search, Stats, Trending Items
    │   │   ├── Curriculum.tsx        # MSBTE K-Scheme & I-Scheme Subject Directory
    │   │   ├── LabManuals.tsx        # Practical Manual Solutions & Downloads
    │   │   ├── MicroProjects.tsx     # Source Code & Project Report Bundles
    │   │   ├── Notes.tsx             # Unit-wise Lecture Notes & PDF Repositories
    │   │   ├── AdminDashboard.tsx    # Moderation Queue, User Role Promotion, Uploads Table
    │   │   ├── MyReports.tsx         # Isolated Student Submissions Workspace
    │   │   ├── Assignments.tsx       # Semester Assignments & Solved Solutions
    │   │   ├── QuestionPapers.tsx    # Previous Year Winter/Summer MSBTE Papers
    │   │   └── Feedback.tsx          # User Feedback Submission
    │   ├── lib/                      # Firebase & API utility configurations
    │   ├── App.tsx                   # Client Routes & Protected Route Wrappers
    │   └── main.tsx                  # Application Entrypoint
    ├── package.json                  # Frontend dependencies
    └── vite.config.ts                # Vite Build Configuration
```

---

## 🗺️ How a User's Journey Works

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Student / User
    participant FE as 💻 React Frontend
    participant BE as ⚙️ Express Backend
    participant DB as 🗄️ Supabase Database
    participant Mail as ✉️ Brevo / Gmail Mailer
    participant AI as 🤖 Groq AI Engine

    User->>FE: 1. Register Account (Email, Password, Name)
    FE->>BE: 2. POST /api/auth/register
    BE->>DB: 3. Create unverified user & generate OTP
    BE->>Mail: 4. Dispatch 6-digit OTP email
    Mail-->>User: 5. Receive OTP Email
    User->>FE: 6. Submit OTP Code
    FE->>BE: 7. POST /api/auth/verify-otp
    BE->>DB: 8. Mark is_verified = true
    BE-->>FE: 9. Return JWT Auth Token

    User->>FE: 10. Ask question in College Mitra Chatbot
    FE->>BE: 11. POST /api/chat (Prompt)
    BE->>AI: 12. Query LLaMA 3.3 70B AI Model
    AI-->>BE: 13. Return dynamic Markdown answer
    BE-->>FE: 14. Render dynamic AI response

    User->>FE: 15. Upload Lab Manual / Micro Project
    FE->>BE: 16. POST /api/materials (Bearer JWT Token)
    BE->>DB: 17. Store with [PENDING][by:user_email] prefix
    BE-->>FE: 18. Material appears in "My Documents" (Isolated to User)

    actor Admin as 🛡️ Admin (Yash Date)
    Admin->>FE: 19. Open Admin Dashboard
    FE->>BE: 20. GET /api/materials (Pending Queue)
    Admin->>FE: 21. Click "Approve Document"
    FE->>BE: 22. PUT /api/materials/:id/approve
    BE->>DB: 23. Strip [PENDING] prefix & publish publicly
```

---

## 💻 Tech Stack Breakdown

| Layer | Technologies & Tools Used |
| :--- | :--- |
| **Frontend UI** | **React 19**, **TypeScript**, Vite 8, React Router v7, Lucide React Icons, Vanilla CSS Design System |
| **Backend API** | **Node.js**, **Express 5**, JavaScript (CommonJS), JsonWebToken, BcryptJS, CORS, Rate Limiters |
| **Database & Auth** | **Supabase (PostgreSQL)**, Row Level Security (RLS), Custom JWT Authentication |
| **Artificial Intelligence** | **Groq API** (`llama-3.3-70b-versatile`), **Google Gemini 2.0 Flash** API Fallback |
| **Email Infrastructure** | **Brevo REST API v3**, **Nodemailer** (Gmail SMTP Fallback Pipeline) |
| **Hosting & Cloud** | **Vercel** (Frontend SPA), **Render** (Node.js Web Service) |
| **Version Control** | **Git**, **GitHub** (Clean Commits, Branching, Rebase Pipelines) |

---

## 🗄️ Database Schema (Supabase PostgreSQL)

```mermaid
erDiagram
    users {
        uuid id PK
        string email UK
        string password_hash
        string name
        string role
        boolean is_verified
        timestamp created_at
    }

    materials {
        uuid id PK
        string title
        string description
        string category
        string branch
        string semester
        string subject_code
        string drive_link
        string image_link
        boolean is_trending
        timestamp created_at
    }

    otps {
        uuid id PK
        string email
        string otp_code
        timestamp expires_at
    }

    feedbacks {
        uuid id PK
        string user_email
        string feedback_type
        text message
        timestamp created_at
    }

    users ||--o{ materials : "uploads (tagged by email)"
    users ||--o{ otps : "verifies via"
    users ||--o{ feedbacks : "submits"
```

---

## 📡 API Reference Endpoints

### 🔐 Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new student account & dispatches verification OTP |
| `POST` | `/api/auth/verify-otp` | Public | Validates OTP and activates user account (`is_verified = true`) |
| `POST` | `/api/auth/login` | Public | Authenticates user credentials and returns JWT bearer token |
| `POST` | `/api/auth/forgot-password` | Public | Initiates password reset procedure and sends OTP email |
| `POST` | `/api/auth/reset-password` | Public | Verifies OTP and updates user password hash in Supabase |
| `POST` | `/api/auth/make-admin` | Admin | Grants admin role privileges to specified user email |

### 📚 Study Materials Endpoints (`/api/materials`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/materials` | Public | Retrieves all approved study materials across all categories |
| `POST` | `/api/materials` | User | Submits study material (stamped with `[PENDING][by:email]`) |
| `PUT` | `/api/materials/:id/approve` | Admin | Strips pending tags and publishes material publicly |
| `DELETE` | `/api/materials/:id` | Admin | Deletes specified material from database |
| `PUT` | `/api/materials/:id/trending` | Admin | Toggles trending status for featured home display |

### 🤖 AI Chatbot Endpoint (`/api/chat`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Public | Evaluates user query with Groq LLaMA 3.3 70B & Gemini AI models |

---

## 💡 Engineering & Design Decisions

1. **Groq LLaMA 3.3 70B Primary AI Model over Vanilla Gemini API:**
   - *Rationale:* Standard free-tier Gemini API keys frequently encounter strict per-minute quota limits (`429 RESOURCE_EXHAUSTED`). Integrating Groq API with LLaMA 3.3 70B guarantees instantaneous, high-precision answers with zero quota lockouts.

2. **Isolated User Submissions Architecture:**
   - *Rationale:* Rather than allowing unmoderated uploads to appear publicly or cluttering global feeds, student submissions are automatically prefixed with `[PENDING][by:user_email]`. The backend filters materials so users exclusively see their own pending uploads in "My Documents", while admins review them in the moderation queue.

3. **Multi-Tier Resilient Email Engine:**
   - *Rationale:* Relying on a single email provider risks account signup blocks if API keys drift or hit limits. The custom `sendEmail.js` utility sequentially attempts Brevo REST API v3 -> Gmail SMTP (`nodemailer`) -> Console Logging, ensuring user registration never deadlocks.

---

## 🛠️ Local Installation & Setup Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **Git**

### 1. Clone Repository & Navigate
```bash
git clone https://github.com/YashDate31/College-Sahayak.git
cd College-Sahayak
```

### 2. Configure Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-service-key
ADMIN_EMAIL=yashdate31@gmail.com
GROQ_API_KEY=gsk_your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
BREVO_API_KEY=xkeysib-your_brevo_api_key
EMAIL_USER=collegesahayak@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Start the backend server:
```bash
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Configure Frontend Setup
In a new terminal window (navigate to the project root):
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📜 License & Acknowledgments

This project is created and maintained by **Yash Date**.

* **Developer:** **Yash Vijay Date** ([GitHub Profile](https://github.com/YashDate31))
* **Academic Institute:** Government Polytechnic Awasari (Khurd)
* **Industry Mentor:** Mr. Yuvraj Hande Sir (Somayu Infotech)

*Dhanyawad! (Thanks for reading!)* 🎓
