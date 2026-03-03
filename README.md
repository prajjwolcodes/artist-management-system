# Artist Management System

A comprehensive web application designed to manage artists, music tracks, and artist managers. This system facilitates the relationship between multiple artist managers and multiple artists, with complete role-based access control and music catalog management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [User Roles & Permissions](#user-roles--permissions)

---

## 🎯 Overview

The Artist Management System is a full-stack web application built with Next.js that provides a centralized platform for:

- **Super Admin**: Complete control over the system, user management, and monitoring
- **Artist Managers**: Manage their artists' profiles and music catalogs
- **Artists**: Manage their music tracks and profile information

The system includes user authentication, email verification, role-based access control, and a comprehensive music management interface.

---

## ✨ Features

### Authentication & Authorization
- User registration and login with JWT-based authentication
- Email-based account activation
- Role-based access control (Super Admin, Artist Manager, Artist)
- Secure password hashing with bcrypt
- Session management with HTTP-only cookies

### User Management
- **Super Admin Features**:
  - View all users and artists
  - Manage artist managers
  - Monitor system-wide activities
  - User activation and deactivation

- **Artist Manager Features**:
  - Manage assigned artists
  - Add new artists to the system
  - Monitor artist music catalogs
  - View artist statistics

- **Artist Features**:
  - Manage personal music tracks
  - Add music with album information and genre
  - Update profile information
  - View personal statistics

### Music Management
- Add, edit, and delete music tracks
- Support for genres: RnB, Country, Classic, Rock, Jazz
- Album tracking and organization
- Music gallery with pagination
- Track management interface

### Dashboard & Analytics
- Role-specific dashboards
- Status-based artist filtering
- Recent activity tracking
- Statistics and metrics
- Pagination support for large datasets

### Data Management
- User profile management
- Artist status tracking (active, pending, inactive)
- Comprehensive error handling
- Input validation with Zod schemas
- CSV export capabilities (configured)

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with server-side rendering
- **React 19.2.3** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **React Hook Form** - Form state management
- **Zod** - TypeScript-first schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime

### Database
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### Authentication & Security
- **jsonwebtoken** - JWT token generation and verification
- **bcrypt** - Password hashing
- **crypto** - Cryptographic functions

### Email
- **nodemailer** - Email sending service (configured for Gmail SMTP)

### Development Tools
- **TypeScript** - Type safety for JavaScript
- **ESLint** - Code linting
- **Next Themes** - Dark mode support

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** or **yarn** (v8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

### Required Accounts
- Gmail account (for email notifications)
- Local or remote PostgreSQL database

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd artist-management-system
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Then configure the environment variables (see [Environment Setup](#environment-setup) section).

### Step 4: Initialize Database

Run the database initialization endpoint:

```bash
npm run dev
# Then visit: http://localhost:3000/api/init-db
```

Or use the database setup script if available.

---

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/artist_management

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Testing/Development
TEST_ADMIN_EMAIL=admin@test.com
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db_name` |
| `EMAIL_USER` | Gmail account for sending emails | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail app-specific password (not your regular password) | `xxxxxxxxxxxxxxxx` |
| `NODE_ENV` | Development or production environment | `development` or `production` |
| `NEXT_PUBLIC_API_URL` | Frontend API endpoint URL | `http://localhost:3000` |
| `TEST_ADMIN_EMAIL` | Email for test admin account | `admin@test.com` |

**Note:** For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

---

## 🗄 Database Setup

### Prerequisites
- PostgreSQL installed and running
- Database created (e.g., `artist_management`)

### Manual Setup

1. Connect to PostgreSQL:
```bash
psql -U postgres
```

2. Create the database:
```sql
CREATE DATABASE artist_management;
```

3. Connect to the database:
```sql
\c artist_management
```

4. Create tables (tables are initialized when you visit `/api/init-db`):

The application will automatically create the necessary tables on first run.

### Automatic Setup

Once the application is running, visit:
```
http://localhost:3000/api/init-db
```

This endpoint will create all necessary tables in your PostgreSQL database.

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
artist-management-system/
├── app/
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   └── set-password/
│   │   ├── artist/              # Artist endpoints
│   │   │   ├── [id]/
│   │   │   ├── activate/
│   │   │   └── resend-activation/
│   │   ├── music/               # Music endpoints
│   │   │   └── [id]/
│   │   ├── users/               # User endpoints
│   │   │   ├── [id]/
│   │   │   ├── check-admin/
│   │   │   └── resend-activation/
│   │   └── init-db/             # Database initialization
│   ├── (pages)/                 # Page routes
│   │   ├── (auth)/             # Public auth pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   └── activate/
│   │   └── (dashboard)/        # Protected dashboard pages
│   │       ├── admin/          # Super admin pages
│   │       ├── artist/         # Artist pages
│   │       └── manager/        # Manager pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   ├── layouts/                 # Layout components
│   ├── admin/                   # Admin-specific components
│   ├── artist/                  # Artist-specific components
│   ├── manager/                 # Manager-specific components
│   ├── navigation/              # Navigation components
│   └── pagination/              # Pagination components
├── lib/
│   ├── types.ts                 # TypeScript type definitions
│   ├── db.ts                    # Database connection pool
│   ├── utils.ts                 # Utility functions
│   ├── auth-context.tsx         # Authentication context
│   ├── generateToken.ts         # JWT token utilities
│   ├── mail.ts                  # Email service
│   ├── initializeDb.ts          # Database initialization
│   ├── pagination.ts            # Pagination utilities
│   └── mock-data.ts             # Mock data for development
├── helpers/
│   ├── authorize.ts             # Authorization helpers
│   └── route-protection.ts      # Route protection utilities
├── hooks/
│   └── use-toast.ts            # Toast notification hook
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/set-password` - Set or change password

### Artists
- `GET /api/artist` - Get all artists
- `GET /api/artist/[id]` - Get specific artist details
- `POST /api/artist` - Create new artist
- `PUT /api/artist/[id]` - Update artist
- `DELETE /api/artist/[id]` - Delete artist
- `POST /api/artist/activate/[id]` - Activate artist account
- `POST /api/artist/resend-activation` - Resend activation email

### Music
- `GET /api/music` - Get all music tracks
- `GET /api/music/[id]` - Get specific music track
- `POST /api/music` - Create new music track
- `PUT /api/music/[id]` - Update music track
- `DELETE /api/music/[id]` - Delete music track

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user
- `GET /api/users/check-admin` - Check if admin exists
- `POST /api/users/resend-activation` - Resend activation email

### System
- `POST /api/init-db` - Initialize database tables

---

## 👥 User Roles & Permissions

### Super Admin
- ✅ View all users and artists
- ✅ Manage artist managers
- ✅ Activate/deactivate users
- ✅ System administration
- ✅ View all music tracks
- ✅ User management dashboard

### Artist Manager
- ✅ View assigned artists
- ✅ Add new artists
- ✅ Manage artist information
- ✅ View artist music catalogs
- ✅ Manage assigned artist's music
- ✅ Manager dashboard

### Artist
- ✅ Update personal profile
- ✅ Add music tracks
- ✅ Manage own music catalog
- ✅ View personal statistics
- ✅ Artist dashboard

---

## 🚀 Getting Started Quick Guide

1. **Install dependencies**: `npm install`
2. **Setup database**: Set `DATABASE_URL` in `.env.local`
3. **Configure email**: Set `EMAIL_USER` and `EMAIL_PASS` in `.env.local`
4. **Start development server**: `npm run dev`
5. **Initialize database**: Visit `http://localhost:3000/api/init-db`
6. **Register first admin**: Go to `http://localhost:3000/register`
7. **Login**: Use your credentials at `http://localhost:3000/login`

---

## 📝 Notes

- The first user registered will automatically become a **Super Admin**
- Subsequent users need Super Admin approval to register managers
- Artist activation requires email verification
- Use Gmail app-specific passwords, not your regular password
- Tokens expire based on JWT configuration
- All passwords are encrypted with bcrypt

---

## 📞 Support

For issues or questions, please refer to the project documentation or contact the development team.
