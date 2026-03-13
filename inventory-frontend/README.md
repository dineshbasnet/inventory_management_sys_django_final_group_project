# Inventory Management System - Frontend

This is the frontend for the Inventory Management System, built with React and Vite. It provides a clean, responsive user interface for managing inventory, suppliers, purchase orders, stock, and reports.

---

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM v6
- Lucide React

## Prerequisites

- Node.js 18 or above
- npm 9 or above
- Backend server must be running at http://127.0.0.1:8000

---

## Setup Instructions

### Step 1 - Clone the Repository

```bash
git clone https://github.com/dineshbasnet/inventory_management_sys_django_final_group_project.git
cd inventory_management_sys_django_final_group_project/inventory-frontend
```

### Step 2 - Install Dependencies

```bash
npm install
```

### Step 3 - Start Development Server

```bash
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Environment and Proxy

The Vite development server is configured to proxy all API requests to the Django backend. This is set in `vite.config.js`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    }
  }
}
```

This means any request to `/api/...` from the frontend is automatically forwarded to `http://127.0.0.1:8000/api/...`. No additional configuration is needed.

---

## Authentication

The app uses JWT tokens for authentication. On login, the access token and refresh token are stored in `localStorage`. The axios instance in `src/api/axios.js` automatically attaches the token to every request.

| Token | Storage Key | Lifetime |
|-------|-------------|----------|
| Access Token | access_token | 60 minutes |
| Refresh Token | refresh_token | 7 days |

When the access token expires, the user is automatically redirected to the login page.

---

## Pages and Routes

| Route | Page | Access |
|-------|------|--------|
| /login | Login Page | Public |
| / | Dashboard | All users |
| /products | Products | All users |
| /categories | Categories | All users |
| /suppliers | Suppliers | All users |
| /orders | Purchase Orders | All users |
| /stock | Stock Management | All users |
| /reports | Reports | All users |
| /users | User Management | Admin only |

---

## Role Based Access

The sidebar automatically shows or hides navigation items based on the logged in user's role.

| Page | Admin | Manager | Staff |
|------|-------|---------|-------|
| Dashboard | Yes | Yes | Yes |
| Products | Yes | Yes | Yes |
| Categories | Yes | Yes | Yes |
| Suppliers | Yes | Yes | Yes |
| Orders | Yes | Yes | Yes |
| Stock | Yes | Yes | Yes |
| Reports | Yes | Yes | Yes |
| Users | Yes | No | No |

---

## Tailwind CSS Setup

Tailwind is configured in `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
```

The base directives are included in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Branch Structure

| Branch | Responsible Member | Pages |
|--------|--------------------|-------|
| feature/frontend-auth | Dinesh Basnet | Login, Layout, Sidebar, Navbar, AuthContext |
| feature/frontend-products | Bibek Yadav | ProductsPage, CategoriesPage |
| feature/frontend-orders | Roshan Mandal | OrdersPage, SuppliersPage |
| feature/frontend-stock | Jay Prakash Yadav| StockPage, ReportsPage, DashboardPage |


