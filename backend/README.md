# Inventory Management System - Backend

This is the backend for the Inventory Management System, built using Django and Django REST Framework. It provides a RESTful API for managing products, suppliers, purchase orders, stock levels, and generating reports.

---

## Tech Stack

- Python 3.13
- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL
- SimpleJWT 5.3.0
- drf-yasg 1.21.7
- django-cors-headers 4.3.0
- django-filter 23.3


## Prerequisites

- Python 3.10 or above
- PostgreSQL 14 or above
- pip

---

## Setup Instructions

### Step 1 - Clone the Repository

```bash
git clone https://github.com/dineshbasnet/inventory_management_sys_django_final_group_project.git
cd inventory_management_sys_django_final_group_project/backend
```

### Step 2 - Create Virtual Environment

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

### Step 3 - Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4 - Create Environment File

Create a `.env` file in the backend folder:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

### Step 5 - Create Database

Open PostgreSQL and run:

```sql
CREATE DATABASE inventory_db;
```

### Step 6 - Run Migrations

```bash
python manage.py makemigrations users
python manage.py makemigrations products
python manage.py makemigrations suppliers
python manage.py makemigrations orders
python manage.py makemigrations stock
python manage.py makemigrations reports
python manage.py migrate
```

### Step 7 - Create Superuser

```bash
python manage.py createsuperuser
```

Fill in the following when prompted:
```
Email: admin@gmail.com
Username: admin
Password: yourpassword
```

### Step 8 - Start Server

```bash
python manage.py runserver
```

Backend runs at: http://127.0.0.1:8000

API documentation: http://127.0.0.1:8000/api/docs/

---

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/login/ | Public | Login and receive tokens |
| POST | /api/auth/logout/ | All users | Logout and blacklist refresh token |
| POST | /api/auth/token/refresh/ | All users | Get new access token |
| GET | /api/auth/users/me/ | All users | Get current logged in user |
| GET | /api/auth/users/ | Admin | List all users |
| POST | /api/auth/register/ | Admin | Create new user |
| PATCH | /api/auth/users/{id}/ | Admin | Update user details or role |

### Products

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/products/ | All users | List all products |
| POST | /api/products/ | Manager, Admin | Create product |
| GET | /api/products/{id}/ | All users | Get single product |
| PUT | /api/products/{id}/ | Manager, Admin | Update product |
| DELETE | /api/products/{id}/ | Manager, Admin | Delete product |
| GET | /api/products/low_stock/ | All users | Get low stock products |
| GET | /api/products/categories/ | All users | List all categories |
| POST | /api/products/categories/ | Manager, Admin | Create category |
| PUT | /api/products/categories/{id}/ | Manager, Admin | Update category |
| DELETE | /api/products/categories/{id}/ | Manager, Admin | Delete category |

### Suppliers

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/suppliers/ | All users | List all suppliers |
| POST | /api/suppliers/ | Manager, Admin | Create supplier |
| GET | /api/suppliers/{id}/ | All users | Get single supplier |
| PUT | /api/suppliers/{id}/ | Manager, Admin | Update supplier |
| DELETE | /api/suppliers/{id}/ | Manager, Admin | Delete supplier |

### Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/orders/purchase-orders/ | All users | List all purchase orders |
| POST | /api/orders/purchase-orders/ | Manager, Admin | Create purchase order |
| GET | /api/orders/purchase-orders/{id}/ | All users | Get single order |
| DELETE | /api/orders/purchase-orders/{id}/ | Manager, Admin | Delete draft order |
| POST | /api/orders/purchase-orders/{id}/approve/ | Manager, Admin | Approve pending order |
| POST | /api/orders/purchase-orders/{id}/receive/ | Manager, Admin | Receive approved order and update stock |

### Stock

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/stock/ | All users | Get current stock levels |
| POST | /api/stock/add/ | All users | Add stock manually |
| POST | /api/stock/remove/ | All users | Remove stock manually |
| POST | /api/stock/adjust/ | Manager, Admin | Set exact stock quantity |
| GET | /api/stock/movements/ | All users | Get stock movement history |

### Reports

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/reports/dashboard/ | All users | Get dashboard statistics |
| GET | /api/reports/stock/ | All users | Get stock valuation report |
| GET | /api/reports/movements/?days=30 | All users | Get movement report by days |

---

## User Roles and Permissions

| Role | Access Level |
|------|-------------|
| Admin | Full access to all features including user management |
| Manager | Can create and manage products, suppliers, orders, and stock |
| Staff | Read-only access to most features, can add and remove stock |

---

## Purchase Order Workflow

```
Create Order (pending)
      |
      v
Approve Order (approved)
      |
      v
Receive Order (received) --> Stock automatically increases
```

---

## JWT Token Settings

| Token | Lifetime |
|-------|----------|
| Access Token | 60 minutes |
| Refresh Token | 7 days |

Tokens rotate on refresh and are blacklisted after rotation.

---

## Running After Git Pull

Always run these commands after pulling new code from the repository:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

---

## Team Branch Structure

| Branch | Responsible Member | Description |
|--------|--------------------|-------------|
| main | Leader (Dinesh) | Production ready code |
| feature/users-auth | Dinesh Basnet | Users and authentication |
| feature/products-suppliers | Bibek Yadav | Products and suppliers |
| feature/orders | Roshan Mandal | Purchase orders |
| feature/stock-reports | Jay Prakash Yadav | Stock and reports |

---

## Requirements

```
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.0
django-filter==23.3
drf-yasg==1.21.7
python-decouple==3.8
Pillow==10.1.0
psycopg2-binary==2.9.9
```
