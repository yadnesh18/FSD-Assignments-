# 🛍️ ShopVibe — Full-Stack E-Commerce Application

A production-quality e-commerce web application built with the **MERN stack** (MongoDB, Express, React, Node.js). Features a modern UI with dark mode, JWT authentication, role-based access control, and a full admin dashboard.

---

## 📸 Features

### Customer-Facing
- 🏠 **Home Page** — Hero section, category grid, featured products, feature highlights
- 🛒 **Product Listing** — Search, filter by category & price range, sort, pagination
- 📦 **Product Detail** — Full info, rating, quantity selector, related details
- 🧺 **Cart** — Add/remove/update quantities, free-shipping threshold indicator
- 💳 **Checkout** — 3-step flow (Address → Payment → Review), COD / UPI / Card
- 📋 **Order Tracking** — Live order status timeline, full order history
- 🌙 **Dark Mode** — System-aware, toggleable, persistent

### Admin Panel
- 📊 **Dashboard Overview** — Total products, orders, revenue at a glance
- 📦 **Product Management** — Create, edit, delete products via modal form
- 🗂️ **Order Management** — View all orders, update status inline
- 🔑 **Role-Based Access** — Admin-only routes protected on both frontend & backend

### Technical
- JWT authentication with bcrypt password hashing
- Protected & admin-only route middleware
- Cart persisted in MongoDB per user
- Stock management on order creation
- Comprehensive error handling middleware
- Search & filter with MongoDB regex queries
- Pagination on all list endpoints
- Toast notifications throughout
- Responsive design (mobile-first)

---

## 🗂️ Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Sample data seeder
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect + adminOnly
│   │   └── errorMiddleware.js # Global error handler
│   ├── models/
│   │   ├── User.js            # name, email, password, role, cart
│   │   ├── Product.js         # name, description, price, category, image, stock
│   │   └── Order.js           # user, items, address, status, payment
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Loader.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── CartContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AuthPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   └── ProductsPage.jsx
    │   ├── utils/
    │   │   └── api.js         # Axios instance with JWT interceptors
    │   ├── App.jsx            # Router setup
    │   ├── index.css          # Tailwind + global design tokens
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v4, React Router v6 |
| State      | Context API (Auth, Cart, Theme)               |
| HTTP       | Axios with request/response interceptors      |
| Backend    | Node.js, Express.js                           |
| Database   | MongoDB with Mongoose ODM                     |
| Auth       | JWT (jsonwebtoken) + bcryptjs                 |
| UI Icons   | Lucide React                                  |
| Toasts     | react-hot-toast                               |

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18+
- **MongoDB** — running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- **npm** v9+

---

### 1. Clone / Navigate to project

```bash
cd ecommerce
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

Seed the database with sample products and test users:

```bash
npm run seed
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server proxies all `/api` requests to `http://localhost:5000` automatically — no CORS issues during development.

---

### 4. Build for Production

```bash
cd frontend
npm run build
```

The optimised output will be in `frontend/dist/`.

---

## 🔐 Test Credentials

After running `npm run seed`, use these credentials:

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@ecommerce.com    | admin123   |
| User  | john@example.com       | user123    |

> The login page also has a "Fill user credentials" shortcut button.

---

## 📡 API Reference

### Auth
| Method | Endpoint              | Access  | Description         |
|--------|-----------------------|---------|---------------------|
| POST   | /api/auth/register    | Public  | Register new user   |
| POST   | /api/auth/login       | Public  | Login, returns JWT  |
| GET    | /api/auth/me          | Private | Get current user    |

### Products
| Method | Endpoint              | Access       | Description                          |
|--------|-----------------------|--------------|--------------------------------------|
| GET    | /api/products         | Public       | List with search/filter/pagination   |
| GET    | /api/products/:id     | Public       | Single product                       |
| GET    | /api/products/categories | Public    | All unique categories                |
| POST   | /api/products         | Admin only   | Create product                       |
| PUT    | /api/products/:id     | Admin only   | Update product                       |
| DELETE | /api/products/:id     | Admin only   | Delete product                       |

### Cart
| Method | Endpoint              | Access  | Description               |
|--------|-----------------------|---------|---------------------------|
| GET    | /api/cart             | Private | Get user's cart           |
| POST   | /api/cart/add         | Private | Add item                  |
| PUT    | /api/cart/update      | Private | Update item quantity      |
| DELETE | /api/cart/remove      | Private | Remove item               |
| DELETE | /api/cart/clear       | Private | Clear entire cart         |

### Orders
| Method | Endpoint              | Access  | Description               |
|--------|-----------------------|---------|---------------------------|
| POST   | /api/orders           | Private | Place order from cart     |
| GET    | /api/orders           | Private | Get user's orders         |
| GET    | /api/orders/:id       | Private | Get single order          |
| GET    | /api/orders/all       | Admin   | Get all orders            |
| PUT    | /api/orders/:id/status | Admin  | Update order status       |

### Query Parameters (GET /api/products)
| Param    | Example              | Description              |
|----------|----------------------|--------------------------|
| search   | ?search=headphone    | Full-text search         |
| category | ?category=Electronics | Filter by category      |
| minPrice | ?minPrice=500        | Minimum price filter     |
| maxPrice | ?maxPrice=2000       | Maximum price filter     |
| sort     | ?sort=-price         | Sort field (- = desc)    |
| page     | ?page=2              | Page number              |
| limit    | ?limit=12            | Items per page           |

---

## 🌱 Sample Products Included

The seed script creates **12 sample products** across categories:

- ⚡ Electronics — Wireless Headphones, Smart Watch, Mechanical Keyboard, Bluetooth Speaker, Wireless Charger
- 👟 Footwear — Running Shoes Pro
- 💼 Accessories — Leather Wallet, Aviator Sunglasses
- 🏃 Sports — Yoga Mat, Steel Water Bottle
- 👕 Clothing — Cotton T-Shirt
- 🏠 Home & Kitchen — Ceramic Mug Set

---

## 🏗️ Architecture Decisions

### Backend
- **MVC Pattern** — Controllers handle logic, Models define schema, Routes map URLs
- **express-async-handler** — Eliminates try/catch boilerplate in controllers
- **JWT in Authorization header** — Stateless, scalable authentication
- **Password never returned** — `select: false` on password field
- **Stock validation** — Checked before order creation, decremented on success
- **Cart in User model** — Embedded for fast reads; populated with product refs

### Frontend
- **Context API** — Lightweight global state for Auth, Cart, and Theme
- **Axios interceptors** — Auto-attach JWT; auto-redirect on 401
- **CSS custom properties** — Single source of truth for theming (dark/light)
- **Stagger animations** — Product grids animate in sequence for polish
- **Vite proxy** — Dev server forwards `/api` to Express, no CORS config needed

---

## 🎨 Design System

The UI uses a custom design system built on Tailwind CSS v4:

- **Font**: Syne (headings) + DM Sans (body)
- **Accent**: `#ff6b35` (warm orange)
- **Surfaces**: Layered neutrals with CSS variables (`--surface`, `--surface-2`, `--surface-3`)
- **Cards**: Consistent `border-radius: 12px`, subtle shadows that intensify on hover
- **Dark Mode**: Fully themed via `.dark` class on `<html>` — all colors use CSS variables

---

## 📝 Environment Variables

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=development          # 'production' disables error stacks

# Database
MONGO_URI=mongodb://localhost:27017/ecommerce

# Authentication
JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRE=30d

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## 🔧 Common Issues

**MongoDB not connecting**
- Ensure MongoDB is running: `mongod --dbpath /data/db`
- Or use MongoDB Atlas: replace `MONGO_URI` with your Atlas connection string

**Port already in use**
- Change `PORT` in `.env` and update `vite.config.js` proxy target accordingly

**"Module not found" errors**
- Run `npm install` in both `backend/` and `frontend/` directories

**Cart shows empty after login**
- Ensure the backend is running and reachable at `http://localhost:5000`

---

## 📄 License

MIT — free to use for academic and personal projects.
