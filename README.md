#  Salon Appointment & Service Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?style=for-the-badge&logo=mongodb)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=for-the-badge&logo=prisma)
![JWT](https://img.shields.io/badge/JWT-Auth-red?style=for-the-badge&logo=jsonwebtokens)

**A comprehensive backend system for managing salon appointments, stylists, services, and time slots with role-based access control.**

[Live Demo](#-live-api) · [Documentation](#-api-documentation) 

</div>

---

## Overview

The **Salon Appointment & Service Management System** is a robust backend API designed to streamline salon operations. Built with **TypeScript**, **Express.js**, and **MongoDB**, it provides a complete solution for managing appointments, stylists, services, and customer bookings with enforced business rules and comprehensive error handling.

## Admin Credentials

For testing and demonstration purposes:

```
Email: admin@salon.com
Password: Admin123
```


---

## 🌐 Live API

**Production URL:** `https://saloonappointment-production.up.railway.app`

**API Base URL:** `https://saloonappointment-production.up.railway.app/api/v1`

**Health Check:** [https://saloonappointment-production.up.railway.app](https://saloonappointment-production.up.railway.app)

**Status:**  Live and Running

---

### Key Highlights

- **Role-Based Access Control**: Admin, Stylist, and Customer roles with specific permissions
- **Smart Scheduling**: Prevents double bookings and enforces time slot limits
- **Business Logic**: 8 slots/day limit, 2-hour cancellation policy, 1:1 booking ratio
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Type Safety**: Full TypeScript implementation with Prisma ORM
- **Modular Architecture**: Clean, maintainable, and scalable codebase

---

## Features

###  Admin Features
- Create and manage stylist profiles
- Define service categories and pricing
- Schedule time slots (max 8 per stylist per day)
- View all appointments and manage statuses
- Full control over system configuration

### Stylist Features
- View assigned appointments
- Check daily schedule
- Access customer booking information

### Customer Features
- Self-registration and profile management
- Browse available services and stylists
- Book appointments with available time slots
- View booking history
- Cancel appointments (minimum 2 hours notice)

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **ORM** | Prisma  |
| **Authentication** | JSON Web Tokens (JWT) |
| **Validation** | Zod |
| **Password Hashing** | Bcrypt |
| **Architecture** | Modular Pattern |
| **Deployment** | Railway |

---

##  Entity Relationship Diagram

![ERD Diagram](erd.png)

##  Database Schema 

### 👤 User Model
```typescript
{
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'STYLIST' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'SUSPENDED';
  emailVerified: boolean;
  isDeleted: boolean;
  profileImage?: string;
  lastLoginAt?: Date;
  suspendedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Stylist Model
```typescript
{
  id: string;
  userId: string;
  bio?: string;
  specialization: string[];
  experience?: number;
  rating: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Model
```typescript
{
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  image?: string;
  isActive: boolean;
  stylistId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### TimeSlot Model
```typescript
{
  id: string;
  stylistId: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Appointment Model
```typescript
{
  id: string;
  customerId: string;
  stylistId: string;
  serviceId: string;
  timeSlotId: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Database Models

- **User**: Manages all user roles (Admin, Stylist, Customer)
- **Stylist**: Extended profile for stylists with specializations
- **Service**: Service categories offered (Haircut, Facial, etc.)
- **TimeSlot**: Available appointment slots (max 8/day per stylist)
- **Appointment**: Customer bookings with status tracking

### Relationships

- `User ↔ Stylist`: One-to-One (when role is STYLIST)
- `User ↔ Appointment`: One-to-Many (customers)
- `Stylist ↔ Service`: One-to-Many
- `Stylist ↔ TimeSlot`: One-to-Many
- `TimeSlot ↔ Appointment`: One-to-One (prevents double booking)

---

##  Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**


git clone https://github.com/AMLAN1000/SaloonAppointment.git
cd SaloonAppointment


2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/salon_db?retryWrites=true&w=majority"

# Server Configuration
NODE_ENV=development
PORT=5050

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this
EXPIRES_IN=90d


# Security
BCRYPT_SALT_ROUNDS=12


```

4. **Generate Prisma Client**

```bash
npx prisma generate
```

5. **Push database schema**

```bash
npx prisma db push
```

6. **Start the development server**

```bash
npm run dev
```

The server will start at `http://localhost:5050`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB connection string |  Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `BCRYPT_SALT_ROUNDS` | Rounds for password hashing |  Yes |
| `PORT` | Server port number |  No (default: 5050) |
| `NODE_ENV` | Environment mode |  No (default: development) |

---

## 📚 API Documentation

### Base URL

**Local**: `http://localhost:5050/api/v1`  
**Production**: `https://saloonappointment-production.up.railway.app/`

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

### 🔐 Authentication Endpoints

#### Register Customer
```http
POST /auth/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@salon.com",
  "password": "Admin123"
}
```

#### Get Profile
```http
GET /auth/me
Authorization: Bearer <token>
```

---

### Stylist Endpoints

#### Create Stylist (Admin Only)
```http
POST /stylists
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "fullName": "Emily Davis",
  "email": "emily@salon.com",
  "password": "stylist123",
  "phoneNumber": "+1234567890",
  "bio": "Expert hair stylist with 10 years experience",
  "specialization": ["Haircut", "Coloring", "Styling"],
  "experience": 10
}
```

#### Get All Stylists
```http
GET /stylists
GET /stylists?isAvailable=true
GET /stylists?searchTerm=emily
```

#### Get Stylist by ID
```http
GET /stylists/:id
```

#### Update Stylist (Admin Only)
```http
PATCH /stylists/:id
Authorization: Bearer <admin-token>
```

#### Delete Stylist (Admin Only)
```http
DELETE /stylists/:id
Authorization: Bearer <admin-token>
```

---

### Service Endpoints

#### Create Service (Admin Only)
```http
POST /services
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Premium Haircut",
  "description": "Professional haircut with styling",
  "price": 65.00,
  "stylistId": "stylist-id-here"
}
```

#### Get All Services
```http
GET /services
GET /services?stylistId=xxx
GET /services?isActive=true
```

#### Get Service by ID
```http
GET /services/:id
```

#### Update Service (Admin Only)
```http
PATCH /services/:id
Authorization: Bearer <admin-token>
```

#### Delete Service (Admin Only)
```http
DELETE /services/:id
Authorization: Bearer <admin-token>
```

---

### Time Slot Endpoints

#### Create Single Slot (Admin Only)
```http
POST /time-slots
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "stylistId": "stylist-id",
  "date": "2026-01-30",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

#### Create Multiple Slots (Admin Only)
```http
POST /time-slots/bulk
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "stylistId": "stylist-id",
  "date": "2026-01-30",
  "slots": [
    { "startTime": "09:00", "endTime": "10:00" },
    { "startTime": "10:00", "endTime": "11:00" },
    { "startTime": "14:00", "endTime": "15:00" }
  ]
}
```

#### Get Available Slots
```http
GET /time-slots/available?stylistId=xxx&date=2026-01-30
```

#### Get All Time Slots
```http
GET /time-slots
GET /time-slots?stylistId=xxx&date=2026-01-30&isBooked=false
```

#### Delete Time Slot (Admin Only)
```http
DELETE /time-slots/:id
Authorization: Bearer <admin-token>
```

---

### Appointment Endpoints

#### Book Appointment (Customer Only)
```http
POST /appointments
Authorization: Bearer <customer-token>
```

**Request Body:**
```json
{
  "stylistId": "stylist-id",
  "serviceId": "service-id",
  "timeSlotId": "slot-id",
  "notes": "Please use organic products"
}
```

**Success Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Appointment booked successfully",
  "data": {
    "id": "...",
    "customer": {
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "stylist": {
      "user": {
        "fullName": "Emily Davis"
      }
    },
    "service": {
      "name": "Premium Haircut",
      "price": 65
    },
    "timeSlot": {
      "date": "2026-01-30T00:00:00.000Z",
      "startTime": "09:00"
    },
    "status": "PENDING"
  }
}
```

#### Get My Appointments (Customer)
```http
GET /appointments/my-appointments
GET /appointments/my-appointments?status=PENDING
Authorization: Bearer <customer-token>
```

#### Get Stylist Appointments (Stylist/Admin)
```http
GET /appointments/stylist/:stylistId
GET /appointments/stylist/:stylistId?date=2026-01-30
Authorization: Bearer <stylist-token>
```

#### Get All Appointments (Admin Only)
```http
GET /appointments
GET /appointments?status=CONFIRMED&date=2026-01-30
Authorization: Bearer <admin-token>
```

#### Get Appointment by ID
```http
GET /appointments/:id
Authorization: Bearer <token>
```

#### Cancel Appointment
```http
PATCH /appointments/:id/cancel
Authorization: Bearer <customer-token>
```

**Request Body:**
```json
{
  "cancellationReason": "Schedule conflict"
}
```

#### Update Appointment Status (Admin Only)
```http
PATCH /appointments/:id/status
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Valid Statuses:** `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`

---
## 📋 API Endpoints Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| **Authentication** |
| POST | `/auth/register` | Public | Register new customer |
| POST | `/auth/login` | Public |  User login (Admin/Stylist/Customer) |
| GET | `/auth/me` | All | Get current user profile |
| **Stylists** |
| POST | `/stylists` | Admin | Create new stylist |
| GET | `/stylists` | All | Get all stylists |
| GET | `/stylists/:id` | All | Get stylist by ID |
| PATCH | `/stylists/:id` | Admin | Update stylist profile |
| DELETE | `/stylists/:id` | Admin | Delete stylist |
| **Services** |
| POST | `/services` | Admin | Create new service |
| GET | `/services` | All | Get all services |
| GET | `/services/:id` | All | Get service by ID |
| PATCH | `/services/:id` | Admin |  Update service |
| DELETE | `/services/:id` | Admin |  Delete service |
| **Time Slots** |
| POST | `/time-slots` | Admin |  Create single time slot |
| POST | `/time-slots/bulk` | Admin |  Create multiple slots (max 8/day) |
| GET | `/time-slots` | All |  Get all time slots |
| GET | `/time-slots/available` | All |  Get available slots |
| DELETE | `/time-slots/:id` | Admin |  Delete time slot |
| **Appointments** |
| POST | `/appointments` | Customer |  Book appointment |
| GET | `/appointments/my-appointments` | Customer |  View own appointments |
| GET | `/appointments/stylist/:stylistId` | Stylist/Admin |  Get stylist's appointments |
| GET | `/appointments` | Admin |  Get all appointments |
| GET | `/appointments/:id` | All |  Get appointment by ID |
| PATCH | `/appointments/:id/cancel` | Customer |  Cancel appointment (2hr notice) |
| PATCH | `/appointments/:id/status` | Admin |  Update appointment status |
---
## Testing Guide

Follow this step-by-step guide to test the complete booking flow:

### Step 1: Admin Login

```bash
curl -X POST https://saloonappointment-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@salon.com",
    "password": "Admin123"
  }'
```

**Save the `accessToken` from the response**

### Step 2: Create a Stylist (Admin)

```bash
curl -X POST https://saloonappointment-production.up.railway.app/api/v1/stylists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "fullName": "Emily Davis",
    "email": "emily@salon.com",
    "password": "stylist123",
    "phoneNumber": "+1234567890",
    "bio": "Expert hair stylist",
    "specialization": ["Haircut", "Coloring"],
    "experience": 10
  }'
```

**Save the stylist `id`**

### Step 3: Create a Service (Admin)

```bash
curl -X POST https://saloonappointment-production.up.railway.app/api/v1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "Premium Haircut",
    "description": "Professional haircut with styling",
    "price": 65.00,
    "stylistId": "<stylist-id>"
  }'
```

**Save the service `id`**

### Step 4: Create Time Slots (Admin)

```bash
curl -X POST https://saloonappointment-production.up.railway.app/api/v1/time-slots/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "stylistId": "<stylist-id>",
    "date": "2026-01-30",
    "slots": [
      { "startTime": "09:00", "endTime": "10:00" },
      { "startTime": "10:00", "endTime": "11:00" },
      { "startTime": "14:00", "endTime": "15:00" }
    ]
  }'
```

**Save a `timeSlotId`**

### Step 5: Register as Customer

```bash
curl -X POST https://saloonappointment-production.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sarah Johnson",
    "email": "sarah@example.com",
    "password": "customer123",
    "phoneNumber": "+1987654321"
  }'
```

**Save the customer `accessToken`**

### Step 6: Browse Services

```bash
curl https://saloonappointment-production.up.railway.app/api/v1/services
```

### Step 7: Check Available Slots

```bash
curl "https://saloonappointment-production.up.railway.app/api/v1/time-slots/available?stylistId=<stylist-id>&date=2026-01-30"
```

### Step 8: Book Appointment (Customer)

```bash
curl -X POST https://saloonappointment-production.up.railway.app/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer-token>" \
  -d '{
    "stylistId": "<stylist-id>",
    "serviceId": "<service-id>",
    "timeSlotId": "<slot-id>",
    "notes": "First time customer"
  }'
```

### Step 9: View My Appointments

```bash
curl https://saloonappointment-production.up.railway.app/api/v1/appointments/my-appointments \
  -H "Authorization: Bearer <customer-token>"
```

### Step 10: Cancel Appointment

```bash
curl -X PATCH https://saloonappointment-production.up.railway.app/api/v1/appointments/<appointment-id>/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer-token>" \
  -d '{
    "cancellationReason": "Schedule conflict"
  }'
```

---

## Business Rules

### Appointment Scheduling
- Maximum **8 slots per stylist per day**
- Each slot lasts exactly **1 hour**
- **1:1 ratio** enforced (1 customer per stylist per slot)
- Once booked, slot becomes **unavailable**
- Admin manages the master schedule

### Booking System
- Customers can only book **available slots**
- Cannot book **two stylists** in the same time slot
- Cancellation requires **at least 2 hours** notice
- Automatic slot validation and conflict prevention

### Error Handling

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "body.email",
      "message": "Invalid email format"
    }
  ]
}
```

**Unauthorized Access:**
```json
{
  "success": false,
  "message": "Forbidden!",
  "errorSources": [
    {
      "type": "ApiError",
      "details": "Forbidden!"
    }
  ]
}
```

**Slot Already Booked:**
```json
{
  "success": false,
  "message": "The selected time slot is already booked for this stylist"
}
```

**Daily Limit Reached:**
```json
{
  "success": false,
  "message": "Daily limit reached: Maximum 8 slots per stylist per day"
}
```

---



## 📁 Project Structure

```
salon-management-system/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── db/
│   │   │   └── db.ts         # Database initialization
│   │   ├── middlewares/
│   │   │   ├── auth.ts       # Authentication middleware
│   │   │   ├── globalErrorHandler.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules/
│   │   │   ├── Auth/         # Authentication module
│   │   │   ├── Stylist/      # Stylist management
│   │   │   ├── Service/      # Service management
│   │   │   ├── TimeSlot/     # Time slot scheduling
│   │   │   └── Appointment/  # Appointment booking
│   │   └── routes/
│   │       └── index.ts      # Route aggregation
│   ├── config/
│   │   └── index.ts          # Configuration
│   ├── errors/
│   │   ├── ApiErrors.ts      # Custom error classes
│   │   └── handleZodError.ts # Zod error handler
│   ├── helpers/
│   │   └── jwtHelpers.ts     # JWT utilities
│   ├── interfaces/
│   │   └── index.d.ts        # TypeScript interfaces
│   ├── shared/
│   │   ├── catchAsync.ts     # Async error wrapper
│   │   ├── prisma.ts         # Prisma client
│   │   └── sendResponse.ts   # Response formatter
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── .env                       # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── ERD.png                    # Entity Relationship Diagram
└── README.md
```

---

## Deployment

### Railway (Current Deployment)

The application is currently deployed on [Railway](https://railway.app).

**Steps to deploy:**
1. Connect GitHub repository to Railway
2. Add environment variables
3. Railway auto-detects Node.js and builds automatically
4. Access via provided Railway domain

---

</div>