# 🌿 Daintree E-Commerce Platform

A modern, full-stack e-commerce platform built with React and Express.js, featuring secure authentication, shopping cart functionality, and comprehensive admin management capabilities.

![Daintree E-Commerce](./frontend/public/banner.png)

## 🚀 Features

### 🛍️ Customer Features

- **Product Browsing**: Browse products by categories (Laptops, Desktops, Smartphones)
- **Advanced Search**: Real-time product search with optimized queries
- **Shopping Cart**: Add/remove items with quantity management and stock validation
- **User Authentication**: Secure registration/login with JWT tokens
- **Email Verification**: OTP-based email verification system
- **Profile Management**: Update personal information and view order history
- **Order Management**: Place orders and track order status
- **Responsive Design**: Mobile-first design with modern UI components

### 🔧 Admin Features

- **Product Management**: Create, edit, and delete products with image uploads
- **Category & Brand Management**: Organize products with dynamic categories and brands
- **Stock Management**: Track and update inventory levels
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **User Management**: Monitor user registrations and activities

### 🛡️ Security Features

- **JWT Authentication**: HTTP-only cookies for secure token storage
- **Password Hashing**: bcrypt encryption for user passwords
- **Email Verification**: OTP-based verification with expiration
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Client and server-side data validation
- **CORS Configuration**: Secure cross-origin resource sharing

## 🛠️ Tech Stack

### Frontend

- **React 19.1.0** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email sending service
- **Cookie Parser** - HTTP cookie parsing
- **CORS** - Cross-origin resource sharing

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Nodemon** - Development server auto-restart
- **Cloudinary** - Image hosting and management

## � Project Structure

```
Daintree/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx    # Navigation component
│   │   │   └── Footer.jsx    # Footer component
│   │   ├── context/          # React Context API
│   │   │   ├── AuthContext.jsx   # Authentication context
│   │   │   ├── AuthProvider.jsx  # Auth state provider
│   │   │   ├── CartContext.jsx   # Cart context
│   │   │   └── CartProvider.jsx  # Cart state provider
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.jsx      # Landing page
│   │   │   ├── LoginPage.jsx     # Login form
│   │   │   ├── SignUp.jsx        # Registration form
│   │   │   ├── ProfilePage.jsx   # User profile
│   │   │   ├── ProductPage.jsx   # Product listing
│   │   │   ├── SingleProductPage.jsx # Product details
│   │   │   ├── CartPage.jsx      # Shopping cart
│   │   │   ├── AdminPage.jsx     # Admin dashboard
│   │   │   ├── VerifyEmailPage.jsx # Email verification
│   │   │   └── ForgotPassPage.jsx # Password reset
│   │   ├── lib/              # Utility libraries
│   │   │   └── axios.js      # API client configuration
│   │   ├── assets/           # Static assets
│   │   └── App.jsx           # Main app component
│   ├── public/               # Public assets
│   └── package.json          # Frontend dependencies
├── backend/                   # Express.js backend application
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   │   ├── userController.js        # User management
│   │   │   ├── productController.js     # Product operations
│   │   │   ├── orderController.js       # Order processing
│   │   │   ├── categoryController.js    # Category management
│   │   │   ├── emailVerificationController.js # Email services
│   │   │   └── PasswordController.js    # Password reset
│   │   ├── models/           # Database schemas
│   │   │   ├── user.js       # User schema
│   │   │   ├── product.js    # Product schema
│   │   │   ├── order.js      # Order schema
│   │   │   └── productCategory.js # Category schema
│   │   ├── routes/           # API endpoints
│   │   │   ├── authRoutes.js     # Authentication routes
│   │   │   ├── productRoutes.js  # Product routes
│   │   │   ├── orderRoutes.js    # Order routes
│   │   │   ├── categoryRoutes.js # Category routes
│   │   │   ├── brandRoutes.js    # Brand routes
│   │   │   └── mailRoutes.js     # Email routes
│   │   ├── middleware/       # Custom middleware
│   │   │   └── authMiddleware.js # JWT verification
│   │   ├── utils/            # Helper functions
│   │   │   └── generateToken.js  # JWT token generation
│   │   ├── config/           # Configuration
│   │   │   └── db.js         # Database connection
│   │   └── server.js         # Express server setup
│   └── package.json          # Backend dependencies
└── README.md                 # Project documentation
```

## � Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/daintree
JWT_SECRET=your_jwt_secret_key
MAX_AGE=604800000
EMAIL=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

**Frontend (.env)**

```env
VITE_API_URL=http://localhost:3000/api
```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/daintree.git
   cd daintree
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the development servers**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🔌 API Documentation

### Authentication Endpoints

```
POST /api/auth/register          # Register new user
POST /api/auth/login             # Login user
GET  /api/auth/profile           # Get user profile (protected)
GET  /api/auth/logout            # Logout user (protected)
GET  /api/auth/getProfile        # Get detailed user profile (protected)
PUT  /api/auth/updateProfile     # Update user profile (protected)
DELETE /api/auth/deleteProfile   # Delete user account (protected)
POST /api/auth/forgotPassword    # Send password reset OTP
POST /api/auth/verifyResetCode   # Verify password reset OTP
POST /api/auth/resetPassword     # Reset user password
```

### Product Endpoints

```
GET  /api/products                    # Get all products
GET  /api/products/getById/:id        # Get product by ID
GET  /api/products/search?search=query # Search products
GET  /api/products/getByCategory/:category # Get products by category
POST /api/products                    # Create product (admin)
PUT  /api/products/:id                # Update product (admin)
DELETE /api/products/:id              # Delete product (admin)
GET  /api/products/total              # Get total product count
```

### Order Endpoints

```
POST /api/orders                      # Create new order (protected)
```

### Category & Brand Endpoints

```
GET  /api/categories                  # Get all categories
GET  /api/brands/:category            # Get brands by category
```

### Email Verification Endpoints

```
POST /api/mail/verify-otp            # Verify email OTP (protected)
GET  /api/mail/send-mail-test        # Test email service
```

## 📱 Usage Guide

### 🏠 Customer Workflow

1. **Browse Products**

   - Visit the homepage to see featured products
   - Navigate through categories (Laptops, Desktops, Smartphones)
   - Use the search functionality to find specific products

2. **User Registration**

   - Click "Sign Up" and fill in required information
   - Verify your email using the OTP sent to your inbox
   - Login with your credentials

3. **Shopping Experience**

   - View product details on individual product pages
   - Add items to cart with quantity selection
   - Manage cart items (update quantities, remove items)
   - Proceed to checkout and place orders

4. **Profile Management**
   - Update personal information
   - View order history and track order status
   - Manage account settings

### 🔧 Admin Workflow

1. **Admin Access**

   - Login with admin credentials
   - Access the admin dashboard at `/admin`

2. **Product Management**

   - Add new products with images, descriptions, and pricing
   - Update existing product information and stock levels
   - Delete products from the catalog

3. **Category & Brand Management**
   - Create new product categories
   - Add brands within categories
   - Organize product hierarchy

## 🎨 UI/UX Features

### Design Philosophy

- **Mobile-First**: Responsive design that works on all devices
- **Dark Theme**: Modern dark theme with DaisyUI components
- **Smooth Animations**: CSS transitions and keyframe animations
- **Intuitive Navigation**: Clear navigation with breadcrumbs
- **Loading States**: Interactive loading spinners and skeletons

### Accessibility

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: High contrast ratios for readability
- **Responsive Text**: Scalable typography for all screen sizes

## � Security Measures

### Authentication Security

- JWT tokens stored in HTTP-only cookies
- Automatic token expiration and refresh
- Password hashing with bcrypt (10 rounds)
- Email verification with OTP system

### Data Protection

- Input validation on both client and server
- MongoDB injection prevention
- CORS configuration for API security
- Environment variable protection

### Session Management

- Automatic authentication checks every 6 seconds
- Secure logout with token invalidation
- Protected routes with middleware verification

## 🚀 Performance Optimizations

### Frontend Optimizations

- Vite for fast development and building
- Code splitting with React lazy loading
- Image optimization with proper loading states
- Debounced search queries
- Local storage for cart persistence

### Backend Optimizations

- MongoDB indexing for faster queries
- Efficient database queries with population
- Proper error handling and logging
- Session management for transactions

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm run test
```

### Backend Testing

```bash
cd backend
npm run test
```

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend Deployment (Railway/Heroku)

```bash
cd backend
# Set environment variables in deployment platform
# Deploy with npm start
```

### Database Deployment

- Use MongoDB Atlas for cloud database
- Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## � Roadmap

### Planned Features

- [ ] Payment integration (Stripe/PayPal)
- [ ] Advanced filtering and sorting
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking with status updates
- [ ] Admin analytics dashboard
- [ ] Multi-language support
- [ ] Social authentication (Google, Facebook)

### Technical Improvements

- [ ] Unit and integration tests
- [ ] API rate limiting
- [ ] Redis caching
- [ ] WebSocket for real-time updates
- [ ] PWA capabilities
- [ ] Docker containerization

## � Known Issues

- Email verification may be slow during peak times
- Mobile cart animations may lag on older devices
- Admin product image uploads require stable internet

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Email: support@daintree.com
- Documentation: [Project Wiki](https://github.com/yourusername/daintree/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DaisyUI** for beautiful UI components
- **TailwindCSS** for utility-first styling
- **MongoDB** for flexible database solutions
- **Cloudinary** for image hosting services
- **React Community** for excellent documentation and support

---

<div align="center">
  <p>Made with ❤️ by the Daintree Team</p>
  <p>© 2024 Daintree E-Commerce Platform. All rights reserved.</p>
</div>
