# 📚 Blogify API Documentation

Complete API reference for the Blogify blogging platform.

## 🌐 Base URL

```
Local Development: http://localhost:5001/api
```

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle

- **Access Token**: Valid for 24 hours
- **Storage**: Client-side in localStorage
- **Refresh**: Manual re-authentication required

---

## 📋 API Endpoints

### 🔑 Authentication Endpoints

#### Register New User

Creates a new user account and returns authentication tokens.

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f8a1b2c3d4e5f6789012ab",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**

- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

---

#### User Login

Authenticates user credentials and returns tokens.

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f8a1b2c3d4e5f6789012ab",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "lastLogin": "2024-01-15T14:25:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:25:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### Validate Token

verify the current JWT token and returns user data.

```http
GET /api/auth/verify
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f8a1b2c3d4e5f6789012ab",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "lastLogin": "2024-01-15T14:25:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:25:00.000Z"
    }
  }
}
```

---

### 📝 Blog Endpoints

#### Get All Blogs

Retrieves paginated list of published blogs with optional filtering.

```http
GET /api/blogs
```

**Query Parameters:**

- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 50
- `search` (optional): Full-text search in title and content
- `tag` (optional): Filter by tag name

**Example:**

```http
GET /api/blogs?page=1&limit=12&search=javascript&tag=web-development
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6789012cd",
      "title": "Getting Started with JavaScript",
      "description": "<p>JavaScript is a versatile programming language...</p>",
      "media": [
        {
          "url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          "alt": "JavaScript code example"
        }
      ],
      "tags": ["javascript", "web-development", "beginners"],
      "authorId": {
        "_id": "65f8a1b2c3d4e5f6789012ab",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "isPublished": true,
      "publishedAt": "2024-01-15T12:00:00.000Z",
      "likes": ["65f8a1b2c3d4e5f6789012ef", "65f8a1b2c3d4e5f6789012gh"],
      "createdAt": "2024-01-15T11:30:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### Get User's Blogs

Retrieves paginated list of blogs created by the authenticated user.

```http
GET /api/blogs/my-blogs
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `search` (optional): Search in user's blogs
- `tag` (optional): Filter by tag
- `published` (optional): Filter by published status (true/false)

**Example:**

```http
GET /api/blogs/my-blogs?page=1&limit=10&published=false
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6789012cd",
      "title": "My Draft Blog Post",
      "description": "<p>This is a draft post...</p>",
      "media": [],
      "tags": ["draft", "work-in-progress"],
      "authorId": {
        "_id": "65f8a1b2c3d4e5f6789012ab",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "isPublished": false,
      "likes": [],
      "createdAt": "2024-01-15T15:30:00.000Z",
      "updatedAt": "2024-01-15T16:45:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### Get Single Blog

Retrieves a specific blog by ID.

```http
GET /api/blogs/:id
```

**Parameters:**

- `id`: Blog ID (MongoDB ObjectId)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6789012cd",
    "title": "Complete Guide to Node.js",
    "description": "<p>Node.js is a powerful runtime...</p>",
    "media": [
      {
        "url": "https://res.cloudinary.com/demo/image/upload/nodejs-guide.jpg",
        "alt": "Node.js architecture diagram"
      }
    ],
    "tags": ["nodejs", "backend", "javascript"],
    "authorId": {
      "_id": "65f8a1b2c3d4e5f6789012ab",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "isPublished": true,
    "publishedAt": "2024-01-15T12:00:00.000Z",
    "likes": ["65f8a1b2c3d4e5f6789012ef"],
    "createdAt": "2024-01-15T11:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

#### Create Blog

Creates a new blog post.

```http
POST /api/blogs
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "My New Blog Post",
  "description": "<p>Rich HTML content with <strong>formatting</strong> and <a href='#'>links</a>.</p>",
  "media": [
    {
      "url": "https://res.cloudinary.com/demo/image/upload/blog-image.jpg",
      "alt": "Blog featured image"
    }
  ],
  "tags": ["web-development", "tutorial", "javascript"],
  "isPublished": true
}
```

**Validation Rules:**

- `title`: Required, 3-200 characters
- `description`: Required, minimum 10 characters
- `media`: Optional array of media objects
- `tags`: Optional array of strings (max 10 tags)
- `isPublished`: Optional boolean, default: false

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "_id": "65f8a1b2c3d4e5f6789012cd",
    "title": "My New Blog Post",
    "description": "<p>Rich HTML content...</p>",
    "media": [...],
    "tags": ["web-development", "tutorial", "javascript"],
    "authorId": "65f8a1b2c3d4e5f6789012ab",
    "isPublished": true,
    "publishedAt": "2024-01-15T16:30:00.000Z",
    "likes": [],
    "createdAt": "2024-01-15T16:30:00.000Z",
    "updatedAt": "2024-01-15T16:30:00.000Z"
  }
}
```

---

#### Update Blog

Updates an existing blog post (only by the author).

```http
PUT /api/blogs/:id
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**

- `id`: Blog ID to update

**Request Body:**

```json
{
  "title": "Updated Blog Title",
  "description": "<p>Updated content...</p>",
  "media": [
    {
      "url": "https://res.cloudinary.com/demo/image/upload/updated-image.jpg",
      "alt": "Updated image"
    }
  ],
  "tags": ["updated-tag", "revision"],
  "isPublished": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "_id": "65f8a1b2c3d4e5f6789012cd",
    "title": "Updated Blog Title",
    "description": "<p>Updated content...</p>",
    // ... other fields with updated values
    "updatedAt": "2024-01-15T17:15:00.000Z"
  }
}
```

---

#### Delete Blog

Deletes a blog post (only by the author).

```http
DELETE /api/blogs/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `id`: Blog ID to delete

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

#### Like/Unlike Blog

Toggles like status on a blog post.

```http
POST /api/blogs/:id/like
```

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `id`: Blog ID to like/unlike

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blog liked successfully",
  "data": {
    "isLiked": true,
    "likesCount": 15
  }
}
```

---

#### Get Popular Tags

Retrieves most used tags across all published blogs.

```http
GET /api/blogs/tags/popular
```

**Query Parameters:**

- `limit` (optional): Number of tags to return, default: 20

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "tag": "javascript",
      "count": 45
    },
    {
      "tag": "web-development",
      "count": 38
    },
    {
      "tag": "tutorial",
      "count": 32
    },
    {
      "tag": "nodejs",
      "count": 28
    },
    {
      "tag": "react",
      "count": 25
    }
  ]
}
```

---

## ❌ Error Responses

### Standard Error Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### HTTP Status Codes

| Status Code | Description      | Example                                 |
| ----------- | ---------------- | --------------------------------------- |
| 200         | Success          | Request completed successfully          |
| 201         | Created          | Resource created successfully           |
| 400         | Bad Request      | Invalid input data                      |
| 401         | Unauthorized     | Invalid or missing authentication token |
| 403         | Forbidden        | Insufficient permissions                |
| 404         | Not Found        | Resource not found                      |
| 422         | Validation Error | Input validation failed                 |
| 500         | Server Error     | Internal server error                   |

### Common Error Examples

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Title is required"
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Access token is required"
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "You can only edit your own blogs"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Blog not found"
}
```

#### 422 Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## 🧪 Testing with cURL

### Register User

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Login User

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Create Blog

```bash
curl -X POST http://localhost:5001/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Blog Post",
    "description": "<p>This is a test blog post.</p>",
    "tags": ["test", "example"],
    "isPublished": true
  }'
```

### Get All Blogs

```bash
curl -X GET "http://localhost:5001/api/blogs?page=1&limit=10"
```

### Get User Blogs

```bash
curl -X GET http://localhost:5001/api/blogs/my-blogs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads are handled via Cloudinary integration on the frontend
- Blog content supports rich HTML formatting
- Tags are automatically converted to lowercase
- Search is case-insensitive and searches both title and content
- Only published blogs appear in public endpoints
- Authors can see their own blogs via `/my-blogs` endpoint

---

**Need help?** Check the main [README.md](README.md) for setup instructions and troubleshooting.
