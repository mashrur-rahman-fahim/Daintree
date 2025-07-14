# 🌿 Daintree E-Commerce Platform

A full-stack e-commerce platform built with React and Express.js, featuring modern UI components, secure authentication, and comprehensive order management.

![Daintree Banner](https://via.placeholder.com/1200x400/1a1a1a/00ff00?text=DAINTREE+-+Empowering+Your+Tech+Lifestyle)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🛍️ Customer Features

- **Product Browsing**: Browse products by categories (Laptops, Desktops, Smartphones)
- **Advanced Search**: Real-time product search with debounced queries
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Secure login/register with JWT tokens
- **Profile Management**: Edit personal information and view order history
- **Order Management**: Place orders and track order status
- **Responsive Design**: Mobile-first design with DaisyUI components

### 🔧 Technical Features

- **Secure Authentication**: JWT tokens stored in HTTP-only cookies
- **Real-time Updates**: Automatic auth checks every 6 seconds
- **Data Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance**: Debounced search, optimized API calls
- **Database Relations**: Proper MongoDB relationships with population

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful UI components for Tailwind
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Elegant notifications
- **Lucide React** - Beautiful icons
- **React Scroll** - Smooth scrolling functionality

### Backend

- **Express.js 5** - Web framework with ES modules
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cookie Parser** - Parse HTTP cookies
- **CORS** - Cross-origin resource sharing

### Development Tools

- **ESLint** - Code linting
- **Nodemon** - Development server auto-restart
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mashrur-rahman-fahim/Daintree.git
   cd Daintree
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   MAX_AGE=604800000
   ```

5. **Start the Development Servers**

   **Backend** (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 🌍 Environment Variables

### Backend (.env)

```env
PORT=3000                           # Server port
MONGO_URI=mongodb://localhost:27017/daintree  # MongoDB connection string
JWT_SECRET=your_super_secret_key    # JWT signing secret
NODE_ENV=development               # Environment mode
MAX_AGE=604800000                  # Cookie max age (7 days in milliseconds)
```

## 📖 Usage

### 🏠 Home Page

- Browse featured products and categories
- Use the search bar to find specific products
- Navigate through different product categories

### 🔐 Authentication

- **Register**: Create a new account with name, email, password, address, and phone
- **Login**: Access your account with email and password
- **Logout**: Secure logout that clears authentication tokens

### 🛒 Shopping

- **Add to Cart**: Click "Buy Now" on any product
- **View Cart**: Check items in your cart with quantity management
- **Place Order**: Complete your purchase (requires authentication)

### 👤 Profile Management

- **View Profile**: See your personal information and order history
- **Edit Profile**: Update your name, phone, and address
- **Order History**: Track your past orders with status updates

## 🔌 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
GET  /api/auth/profile      - Get user profile (protected)
GET  /api/auth/logout       - Logout user (protected)
GET  /api/auth/getProfile   - Get detailed user profile (protected)
PUT  /api/auth/updateProfile - Update user profile (protected)
DELETE /api/auth/deleteProfile - Delete user account (protected)
```

### Product Endpoints

```
GET  /api/products                    - Get all products
GET  /api/products/getById/:id        - Get product by ID
GET  /api/products/search?search=query - Search products
GET  /api/products/getByCategory/:category - Get products by category
POST /api/products                    - Create product
PUT  /api/products/:id                - Update product
DELETE /api/products/:id              - Delete product
```

### Order Endpoints

```
POST /api/orders                      - Create new order (protected)
```

### Category & Brand Endpoints

```
GET  /api/categories                  - Get all categories
GET  /api/brands/:category            - Get brands by category
```

## 📁 Project Structure

```
Daintree/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Database configuration
│   │   ├── controllers/
│   │   │   ├── userController.js   # User authentication logic
│   │   │   ├── productController.js # Product management
│   │   │   └── categoryController.js # Category management
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # JWT authentication
│   │   ├── models/
│   │   │   ├── user.js            # User schema
│   │   │   ├── product.js         # Product schema
│   │   │   └── productCategory.js # Category schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Authentication routes
│   │   │   ├── productRoutes.js   # Product routes
│   │   │   ├── categoryRoutes.js  # Category routes
│   │   │   └── brandRoutes.js     # Brand routes
│   │   ├── utils/
│   │   │   └── generateToken.js   # JWT token generation
│   │   └── server.js              # Express server setup
│   ├── .env                       # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation component
│   │   │   └── Footer.jsx         # Footer component
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Authentication context
│   │   │   ├── AuthProvider.jsx   # Auth state provider
│   │   │   ├── CartContext.jsx    # Cart context
│   │   │   └── CartProvider.jsx   # Cart state provider
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Landing page
│   │   │   ├── LoginPage.jsx      # Login form
│   │   │   ├── SignUp.jsx         # Registration form
│   │   │   ├── ProfilePage.jsx    # User profile
│   │   │   ├── ProductPage.jsx    # Product listing
│   │   │   └── CartPage.jsx       # Shopping cart
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # React entry point
│   ├── lib/
│   │   └── axios.js               # API client configuration
│   ├── public/
│   │   └── banner.png             # Banner image
│   ├── index.html                 # HTML template
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── package.json
├── .github/
│   └── copilot-instructions.md    # AI coding guidelines
└── README.md
```

## 📱 Responsive Design Features

### 🎨 Mobile-First Approach

- **Breakpoints**: Optimized for mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Grid Layouts**: Responsive grid systems that adapt to screen size
- **Typography**: Scalable text sizes across all devices
- **Touch-Friendly**: Optimized button sizes and spacing for mobile interaction

### 🖥️ Desktop Enhancements

- **Sticky Navigation**: Fixed navbar with backdrop blur effect
- **Hover Effects**: Smooth transitions and animations
- **Advanced Search**: Full-width search with dropdown results
- **Multi-Column Layouts**: Efficient use of screen real estate

### 📱 Mobile Optimizations

- **Collapsible Search**: Dropdown search interface for mobile
- **Optimized Images**: Responsive image sizing and loading
- **Gesture-Friendly**: Smooth scrolling and touch interactions
- **Compact Navigation**: Space-efficient mobile navigation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### 📝 Coding Guidelines

- Follow the existing code style and patterns
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevent XSS attacks
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Configured for development and production

## 📊 Performance Optimizations

- **Debounced Search**: Prevents excessive API calls
- **Responsive Images**: Optimized loading and sizing
- **Lazy Loading**: Components loaded as needed
- **Context Optimization**: Efficient state management
- **CSS Animations**: Hardware-accelerated transitions

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

### Environment Setup

- Set `NODE_ENV=production`
- Configure production database
- Set up proper CORS origins
- Use environment-specific JWT secrets

## 📞 Support

For support and questions:

- **GitHub Issues**: [Create an issue](https://github.com/mashrur-rahman-fahim/Daintree/issues)
- **Email**: [Your email here]
- **Documentation**: Check the [GitHub Copilot Instructions](.github/copilot-instructions.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DaisyUI** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **MongoDB** for flexible data storage
- **Express.js** for robust backend framework
- **React** for powerful frontend library

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/mashrur-rahman-fahim">Mashrur Rahman Fahim</a></p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
