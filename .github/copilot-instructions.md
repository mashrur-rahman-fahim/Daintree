# GitHub Copilot Instructions for Daintree E-commerce Platform

## Project Overview

Daintree is a full-stack e-commerce platform built with React frontend and Express.js backend. The application handles product browsing, user authentication, shopping cart functionality, and order management.

## Architecture & Technology Stack

### Frontend (React + Vite)

- **Framework**: React 19 with Vite as build tool
- **Styling**: Tailwind CSS with DaisyUI components (`data-theme="night"`)
- **State Management**: React Context API (AuthContext, CartContext)
- **Routing**: React Router v6 with BrowserRouter
- **HTTP Client**: Axios with withCredentials for cookie-based auth
- **Notifications**: react-hot-toast for user feedback
- **Icons**: Lucide React for UI icons

### Backend (Express.js + MongoDB)

- **Framework**: Express.js 5 with ES modules (`"type": "module"`)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Password Security**: bcrypt for hashing
- **Environment**: Development mode with CORS enabled for localhost:5173

## Development Patterns & Conventions

### File Structure & Naming

```
frontend/src/
├── pages/           # Page components (PascalCase)
├── components/      # Reusable components (PascalCase)
├── context/         # Context providers and definitions
└── lib/             # Utility modules (camelCase)

backend/src/
├── controllers/     # Business logic (camelCase)
├── models/          # Mongoose schemas (camelCase)
├── routes/          # Express routers (camelCase)
├── middleware/      # Auth and validation middleware
└── utils/           # Helper functions
```

### Component Patterns

1. **Page Components**: Use named exports, include Navbar, handle auth checks
2. **Context Usage**: Always import both context and provider separately
3. **State Management**: Use React.useState for component state, Context for global state
4. **Effects**: Multiple useEffect hooks for different concerns (auth, data fetching)

### Authentication Flow

1. **Login/Register**: POST to `/api/auth/login` or `/api/auth/register`
2. **Token Storage**: JWT stored in HTTP-only cookie named `access_token`
3. **Auth Check**: GET `/api/auth/profile` with `withCredentials: true`
4. **Protected Routes**: Use `verify` middleware on backend routes
5. **Frontend Guards**: Check `loggedIn` state and redirect if needed

### API Conventions

- **Base URL**: Development: `http://localhost:3000/api`, Production: `/api`
- **Authentication**: Always include `withCredentials: true` for auth-related requests
- **Error Handling**: Use try-catch with toast notifications for user feedback
- **Response Format**: Consistent JSON responses with message field

### Styling Guidelines

1. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
2. **Grid Layouts**: Use `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` pattern
3. **Theme**: DaisyUI night theme applied at App level
4. **Colors**: Use DaisyUI semantic colors (primary, secondary, accent)
5. **Spacing**: Consistent padding/margin with Tailwind scale

### Database Schema Patterns

- **User Model**: Includes profile fields, order history array with refs
- **Relationships**: Use Mongoose populate for references
- **Timestamps**: All models include `{ timestamps: true }`
- **Validation**: Required fields marked in schema, business logic in controllers

## Common Development Tasks

### Adding New API Endpoints

1. Create controller function in appropriate controller file
2. Add route in corresponding routes file with middleware if needed
3. Update frontend API calls with proper error handling
4. Test with withCredentials for authenticated endpoints

### Adding New Pages

1. Create page component in `frontend/src/pages/`
2. Import and add route in `App.jsx`
3. Include Navbar component
4. Add authentication checks if needed
5. Implement responsive design with Tailwind

### Form Handling

1. Use React.useState for form data object
2. Implement handleChange function for input updates
3. Add client-side validation with toast notifications
4. Use async/await for API calls with proper error handling

### State Management

1. Use Context for global state (auth, cart)
2. Provide context at appropriate level (AuthProvider at root)
3. Use useContext hook in components that need the state
4. Separate concerns with multiple contexts

## Security & Best Practices

### Authentication Security

- JWT tokens in HTTP-only cookies prevent XSS attacks
- Environment variables for secrets (JWT_SECRET, MAX_AGE)
- Password hashing with bcrypt before storage
- Token verification on all protected routes

### Error Handling

- Never expose sensitive data in error messages
- Use consistent error response format
- Client-side validation with toast feedback
- Graceful degradation for network failures

### Performance Considerations

- Use React.StrictMode for development debugging
- Implement proper loading states
- Use useEffect dependencies correctly
- Avoid unnecessary re-renders with proper state structure

## Environment Setup

- Frontend runs on port 5173 (Vite default)
- Backend runs on port 3000
- MongoDB connection string in environment variables
- CORS configured for development mode only

## Key Dependencies to Remember

- **Frontend**: react-router-dom, axios, react-hot-toast, lucide-react
- **Backend**: express, mongoose, jsonwebtoken, bcrypt, cookie-parser, cors
- **Development**: nodemon, @vitejs/plugin-react, tailwindcss, daisyui

## Code Quality Guidelines

1. Use ES6+ features (arrow functions, destructuring, template literals)
2. Prefer async/await over promises
3. Use meaningful variable and function names
4. Include error handling in all async operations
5. Follow React hooks rules (use at top level, consistent dependencies)
6. Use TypeScript patterns even in JavaScript (consistent prop handling)

## Common Gotchas & Solutions

1. **Environment Variables**: Convert string env vars to numbers with `Number()`
2. **Cookie Auth**: Always include `withCredentials: true` in Axios calls
3. **Auth Middleware**: Ensure `req.user` is populated before using
4. **Responsive Design**: Test mobile layouts, avoid fixed widths
5. **Context Providers**: Wrap at correct level in component tree
6. **Route Protection**: Check loading state before redirecting

When implementing new features, always consider the existing patterns for authentication, responsive design, error handling, and state management. Maintain consistency with the established codebase structure and conventions.
