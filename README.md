# Inventory Management System

A full-stack web application for managing inventory, built with Django REST Framework and React. This project was developed as a final group project for the Web Development course.

---

## Video Demonstration

A complete walkthrough of the application is available at the link below. The video covers the login process, user roles, product and category management, purchase order workflow, stock operations, and the reports dashboard.

Video Link: https://www.loom.com/share/5e291417d2124b8f956db2a5c4eb0c65

---

## Table of Contents

- [Project Description](#1-project-description)
- [Technology Stack](#2-technology-stack)
- [Installation Instructions](#3-installation-instructions)
- [Features Implemented](#4-features-implemented)
- [Team Members](#5-team-members)
- [API Documentation](#6-api-documentation)
- [Project Structure](#7-project-structure)

---

## 1. Project Description

### Overview

The Inventory Management System is a web-based application that allows businesses to track and manage their stock, suppliers, and purchase orders through a clean and responsive interface. The system supports multiple user roles and provides real-time visibility into inventory levels, stock movements, and financial valuation of stock.

### Problem Being Solved

Small and medium-sized businesses often struggle to keep accurate records of their inventory. Products go out of stock without warning, purchase orders are tracked manually on paper or spreadsheets, and there is no clear audit trail of who made changes and when. This system solves those problems by providing a centralized platform where all inventory-related activities are recorded, tracked, and accessible to the right people at the right time.

### Key Features

- Role-based access control with three user levels: admin, manager, and staff
- Full product and category management with stock tracking
- Supplier directory with contact information
- Purchase order workflow from creation through approval to receiving
- Automatic stock increase when a purchase order is received
- Manual stock add, remove, and adjustment with movement history
- Dashboard showing live inventory statistics
- Stock valuation report showing the financial value of current inventory
- Stock movement report filterable by time period
- Fully responsive interface that works on mobile, tablet, and desktop

---

## 2. Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.13 | Backend programming language |
| Django | 4.2.7 | Web framework |
| Django REST Framework | 3.14.0 | API development |
| PostgreSQL | 14+ | Relational database |
| SimpleJWT | 5.3.0 | JWT authentication |
| django-cors-headers | 4.3.0 | Cross-origin resource sharing |
| django-filter | 23.3 | Queryset filtering |
| drf-yasg | 1.21.7 | Swagger API documentation |
| python-decouple | 3.8 | Environment variable management |
| psycopg2-binary | 2.9.9 | PostgreSQL database adapter |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | Frontend UI library |
| Vite | 5+ | Frontend build tool |
| Tailwind CSS | 3+ | Utility-first CSS framework |
| Axios | 1+ | HTTP client for API requests |
| React Router DOM | 6+ | Client-side routing |
| Lucide React | 0.383.0 | Icon library |

---

## 3. Installation Instructions

### Prerequisites

Before starting, make sure the following software is installed on your machine.

- Git
- Python 3.10 or above
- Node.js 18 or above
- PostgreSQL 14 or above

Verify installations:

```bash
git --version
python --version
node --version
npm --version
```

---

### Step 1 - Clone the Repository

```bash
git clone https://github.com/dineshbasnet/inventory_management_sys_django_final_group_project.git
cd inventory_management_sys_django_final_group_project
```

---

### Step 2 - Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment.

On Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

On Mac or Linux:
```bash
python -m venv venv
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder and add the following environment variables:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432
```

Create the PostgreSQL database. Open your PostgreSQL client and run:

```sql
CREATE DATABASE inventory_db;
```

Run database migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create an admin superuser:

```bash
python manage.py createsuperuser
```

You will be prompted to enter an email, username, and password. Use these to log in to the application.

Start the backend server:

```bash
python manage.py runserver
```

The backend API is now running at: http://127.0.0.1:8000

Swagger API documentation is available at: http://127.0.0.1:8000/api/docs/

---

### Step 3 - Frontend Setup

Open a new terminal window and navigate to the frontend folder:

```bash
cd inventory-frontend
```

Install Node.js dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend is now running at: http://localhost:5173

---

### Step 4 - Open the Application

Open your browser and go to:

```
http://localhost:5173
```

Log in using the superuser credentials you created in Step 2.

> Both the backend and frontend servers must be running at the same time.

---

### Quick Start Summary

```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate        # Windows
python manage.py runserver

# Terminal 2 - Frontend
cd inventory-frontend
npm run dev
```

---

## 4. Features Implemented

### Authentication and User Management

- JWT-based login and logout
- Access token with 60-minute expiry and 7-day refresh token
- Automatic token refresh and logout on expiry
- User registration by admin only
- Role assignment: admin, manager, staff
- User activation and deactivation
- Current user profile endpoint

### Product Management

- Create, read, update, and delete products
- Product fields: name, SKU, description, cost price, selling price, minimum stock, category, active status
- Filter products by category and active status
- Search products by name, SKU, and description
- Low stock alert endpoint showing products below minimum stock level

### Category Management

- Create, read, update, and delete categories
- Category linked to products
- Product count per category

### Supplier Management

- Create, read, update, and delete suppliers
- Supplier fields: name, company, email, phone, address, active status

### Purchase Order Management

- Create purchase orders with multiple line items
- Each line item includes product, quantity, and unit price
- Unit price auto-filled from product cost price on the frontend
- Row total and grand total calculated automatically
- Order number auto-generated on creation
- Three-step order workflow: pending, approved, received
- Approve action available for pending orders
- Receive action available for approved orders
- Stock levels automatically increase when an order is received
- Delete action available for draft orders

### Stock Management

- View current stock levels for all products
- Add stock manually with reference and notes
- Remove stock manually with validation for insufficient quantity
- Adjust stock to an exact quantity
- Full stock movement history with movement type, quantity, reference, and timestamp
- Stock status: in stock, low stock, out of stock

### Reports and Dashboard

- Dashboard statistics: total products, out of stock count, low stock count, pending orders, total inventory value, recent movements
- Stock valuation report showing quantity, cost price, and total value per product
- Stock movement report grouped by movement type
- Movement report filterable by time period: 7, 30, 60, or 90 days

### Frontend Interface

- Responsive layout with collapsible sidebar
- Role-based sidebar navigation (Users page visible to admin only)
- Spinner loaders and empty state messages throughout
- Inline forms that open and close without page navigation
- Error handling and user-friendly error messages on all forms
- Status badges with color coding for orders and stock levels
- Confirmation dialogs before delete actions

---

## 5. Team Members

| Name | Student ID | Branch | Responsibility |
|------|------------|--------|---------------|
| Dinesh Basnet | 11 | feature/users-auth, feature/frontend-auth | Project lead, authentication, user management, project setup, frontend base layout |
| Bibek Yadav | 6 | feature/products-suppliers, feature/frontend-products | Products app, categories app, suppliers app, frontend products and categories pages |
| Roshan Mandal | 38 | feature/orders, feature/frontend-orders | Orders app, frontend orders and suppliers pages |
| Jay Prakash Yadav | 15 | feature/stock-reports, feature/frontend-stock | Stock app, reports app, frontend stock, reports, and dashboard pages |

---

## 6. API Documentation

The full interactive API documentation is available via Swagger UI once the backend server is running.

URL: http://127.0.0.1:8000/api/docs/

To use authenticated endpoints in Swagger:

1. Call POST /api/auth/login/ with your email and password
2. Copy the access token from the response
3. Click the Authorize button at the top of the Swagger page
4. Enter: Bearer your-access-token-here
5. All subsequent requests will include the token automatically

### Endpoint Summary

| Module | Base URL | Methods Available |
|--------|----------|------------------|
| Auth | /api/auth/ | POST login, POST logout, POST register, GET users, PATCH users |
| Products | /api/products/ | GET, POST, PUT, DELETE, GET low_stock |
| Categories | /api/products/categories/ | GET, POST, PUT, DELETE |
| Suppliers | /api/suppliers/ | GET, POST, PUT, DELETE |
| Orders | /api/orders/purchase-orders/ | GET, POST, DELETE, POST approve, POST receive |
| Stock | /api/stock/ | GET, POST add, POST remove, POST adjust |
| Movements | /api/stock/movements/ | GET |
| Reports | /api/reports/ | GET dashboard, GET stock, GET movements |

## Notes

- The backend and frontend must both be running at the same time for the application to work
- Always run `python manage.py migrate` after pulling new backend code from the repository
- Always run `npm install` after pulling new frontend code in case dependencies have changed
- The Users page in the frontend is only visible and accessible to admin accounts
- Stock levels only change automatically when a purchase order is received, not when it is created or approved
