# Blogify

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **TailwindCSS** - Utility-first styling
- **Radix UI** - Headless component library
- **Tiptap** - Rich text editor
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend

- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin requests

### Cloud Services

- **Cloudinary** - Image storage and optimization

## ✨ Features

### 📝 Content Management

- **Rich Text Editor** with Tiptap (formatting, images, links)
- **Image Gallery** with modal viewer and navigation
- **Tag System** for content organization

### 👤 User Experience

- **Authentication** (Login/Register with JWT)
- **Personal Dashboard** to manage your blogs
- **Search & Filter** functionality
- **Responsive Design** for all devices
- **Like/Unlike** posts
- **Social Sharing** capabilities

### 🎨 Modern UI/UX

- **Glass Morphism** design effects
- **Futuristic Animations** and transitions
- **Dark/Light Mode** support
- **Loading States** and error handling
- **Toast Notifications** for user feedback

## 📁 Project Structure

```
blogify/
├── backend/                 # Express.js API server
│   ├── config/
│   │   └── connectDb.js    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── blogController.js
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── blogs.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── package.json
│   └── server.js           # Entry point
│
├── frontend/               # Next.js application
│   ├── app/               # App Router pages
│   │   ├── (auth)/        # Auth pages group
│   │   ├── (blogs)/       # Blog pages group
│   │   ├── my-blogs/      # User dashboard
│   │   └── globals.css    # Global styles
│   ├── components/        # Reusable components
│   │   ├── auth/          # Auth forms
│   │   └── ui/            # UI components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and config
│   │   ├── api/           # API clients
│   │   └── store/         # Redux store
│   ├── types/             # TypeScript definitions
│   └── package.json
│
├── README.md              # This file
├── API_DOCUMENTATION.md   # API documentation
└── POSTMAN_COLLECTION.json # Postman collection
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env

# Edit .env with your configuration (see Environment Variables section)
# Start the server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env

# Edit .env.local with your configuration
# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/

## ⚙️ Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blogify
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogify

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

```

## 🔧 Development Commands

### Backend Commands

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run lint     # Run linting (if configured)
```

### Frontend Commands

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📚 API Documentation

### Base URL

```
Local: http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Validate Token

```http
GET /api/auth/validate
Authorization: Bearer <token>
```

### Blog Endpoints

#### Get All Blogs

```http
GET /api/blogs?page=1&limit=10&search=query&tag=javascript
```

#### Get User's Blogs

```http
GET /api/blogs/my-blogs?page=1&limit=10&published=true
Authorization: Bearer <token>
```

#### Get Single Blog

```http
GET /api/blogs/:id
```

#### Create Blog

```http
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Blog Post",
  "description": "<p>Rich HTML content...</p>",
  "media": [
    {
      "url": "https://cloudinary.com/image.jpg",
      "alt": "Blog image"
    }
  ],
  "tags": ["javascript", "web-development"],
  "isPublished": true
}
```

#### Update Blog

```http
PUT /api/blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "<p>Updated content...</p>",
  "isPublished": true
}
```

#### Delete Blog

```http
DELETE /api/blogs/:id
Authorization: Bearer <token>
```

#### Like/Unlike Blog

```http
POST /api/blogs/:id/like
Authorization: Bearer <token>
```

#### Get Popular Tags

```http
GET /api/blogs/tags/popular?limit=20
```

## 🏗️ Architecture Overview

### Frontend Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Redux Toolkit   │    │   API Layer     │
│   Router Pages  │◄──►│  State Manager   │◄──►│  Axios Client   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  UI Components  │    │  Custom Hooks    │    │   Backend API   │
│  Radix + Tailw. │    │  Business Logic  │    │  Express Server │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Backend Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Express App   │    │   Controllers    │    │     Models      │
│  Routes & MW    │◄──►│ Business Logic   │◄──►│   MongoDB ODM   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Middleware    │    │    Utilities     │    │    Database     │
│  Auth, CORS,    │    │ Validators, etc  │    │    MongoDB      │
│  Error Handler  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow

1. **User Action** → UI Component
2. **Component** → Redux Action or Custom Hook
3. **Hook/Action** → API Client (Axios)
4. **API Client** → Express Route Handler
5. **Route Handler** → Controller Function
6. **Controller** → Database Model (Mongoose)
7. **Model** → MongoDB Database
8. **Response** flows back through the chain

## 🧪 Testing the Application

### Manual Testing Checklist

#### Authentication Flow

- [ ] Register new user
- [ ] Login with credentials
- [ ] Access protected routes
- [ ] Token validation on refresh
- [ ] Logout functionality

#### Blog Management

- [ ] Create new blog post
- [ ] Preview rich text formatting
- [ ] Publish blog
- [ ] Edit existing blog
- [ ] Delete blog with confirmation

#### User Experience

- [ ] Search blogs
- [ ] Filter by tags
- [ ] Pagination navigation
- [ ] Like/unlike posts
- [ ] Responsive design on mobile
- [ ] Share functionality

## 🚨 Troubleshooting

### Common Issues

#### Backend won't start

```bash
# Check if MongoDB is running
mongosh

# Check if port 5000 is available
lsof -i :5000

# Check environment variables
cat backend/.env
```

#### Frontend won't start

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat frontend/.env.local
```

#### Database Connection Issues

```bash
# For local MongoDB
brew services start mongodb/brew/mongodb-community

# For MongoDB Atlas, check:
# 1. Network access (IP whitelist)
# 2. Database user credentials
# 3. Connection string format
```
