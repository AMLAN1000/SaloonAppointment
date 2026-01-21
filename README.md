# \# Salon Appointment and Service Management System

# 

# \## Project Overview

# A comprehensive salon management system designed to streamline beauty and hair salon operations. The system handles appointment scheduling, service management, and stylist coordination with role-based access control for Admins, Stylists, and Customers.

# 

# \## Technology Stack

# \- \*\*Programming Language\*\*: TypeScript

# \- \*\*Web Framework\*\*: Express.js

# \- \*\*ORM\*\*: Prisma

# \- \*\*Database\*\*: MongoDB

# \- \*\*Authentication\*\*: JWT (JSON Web Tokens)

# \- \*\*Architecture\*\*: Modular Pattern

# 

# \## Entity Relationship Diagram (ERD)

# 

# ```

# ┌─────────────┐         ┌──────────────┐         ┌─────────────┐

# │    User     │1      1 │   Stylist    │1      \* │  TimeSlot   │

# │─────────────│◄────────┤──────────────│◄────────┤─────────────│

# │ id          │         │ id           │         │ id          │

# │ fullName    │         │ userId (FK)  │         │ stylistId   │

# │ email       │         │ bio          │         │ date        │

# │ password    │         │ special...   │         │ startTime   │

# │ phoneNumber │         │ experience   │         │ endTime     │

# │ role        │         │ rating       │         │ isBooked    │

# │ status      │         │ isAvailable  │         └─────────────┘

# │ ...         │         └──────────────┘               │1

# └─────────────┘                │1                      │

# &nbsp;     │1                       │                       │

# &nbsp;     │                        │                       │1

# &nbsp;     │                        │\*                      │

# &nbsp;     │\*                  ┌────▼───────┐         ┌────▼────────┐

# &nbsp;     │                   │  Service   │         │ Appointment │

# &nbsp;     └──────────────────►│────────────│         │─────────────│

# &nbsp;                         │ id         │1      1►│ id          │

# &nbsp;                         │ name       │◄────────┤ customerId  │

# &nbsp;                         │ description│         │ stylistId   │

# &nbsp;                         │ duration   │         │ serviceId   │

# &nbsp;                         │ price      │         │ timeSlotId  │

# &nbsp;                         │ stylistId  │         │ status      │

# &nbsp;                         │ isActive   │         │ notes       │

# &nbsp;                         └────────────┘         └─────────────┘

# ```

# 

# \## Database Schema

# 

# \### User Model

# \- Handles all three roles: ADMIN, STYLIST, CUSTOMER

# \- Fields: id, fullName, email, password, phoneNumber, role, status, emailVerified, isDeleted, profileImage, lastLoginAt, suspendedUntil

# 

# \### Stylist Model

# \- Extended profile for stylists

# \- Fields: id, userId, bio, specialization\[], experience, rating, isAvailable

# 

# \### Service Model

# \- Service categories (Haircut, Facial, etc.)

# \- Fields: id, name, description, duration (60 min), price, stylistId, image, isActive

# 

# \### TimeSlot Model

# \- Admin-created time slots (max 8 per day per stylist)

# \- Fields: id, stylistId, date, startTime, endTime, isBooked

# 

# \### Appointment Model

# \- Customer bookings

# \- Fields: id, customerId, stylistId, serviceId, timeSlotId, status, notes, cancellationReason

# 

# \## Business Rules

# 

# \### Appointment Scheduling

# \- Maximum 8 appointment slots per stylist per day

# \- Each slot lasts exactly 1 hour

# \- 1:1 ratio enforced (1 customer per stylist per slot)

# \- Once booked, slot becomes unavailable

# 

# \### Booking System

# \- Customers can only book available slots

# \- Cannot book two stylists in the same time slot

# \- Cancellation requires at least 2 hours notice

# \- Admins manage master schedule

# 

# \## API Endpoints

# 

# \### Authentication

# ```

# POST   /api/v1/auth/register          - Register new customer

# POST   /api/v1/auth/login             - User login

# GET    /api/v1/auth/me                - Get current user profile

# ```

# 

# \### Stylists (Admin only for create/update/delete)

# ```

# POST   /api/v1/stylists               - Create stylist (Admin)

# GET    /api/v1/stylists               - Get all stylists (Public)

# GET    /api/v1/stylists/:id           - Get stylist by ID (Public)

# PATCH  /api/v1/stylists/:id           - Update stylist (Admin)

# DELETE /api/v1/stylists/:id           - Delete stylist (Admin)

# ```

# 

# \### Services (Admin only for create/update/delete)

# ```

# POST   /api/v1/services               - Create service (Admin)

# GET    /api/v1/services               - Get all services (Public)

# GET    /api/v1/services/:id           - Get service by ID (Public)

# PATCH  /api/v1/services/:id           - Update service (Admin)

# DELETE /api/v1/services/:id           - Delete service (Admin)

# ```

# 

# \### Time Slots (Admin only for create/delete)

# ```

# POST   /api/v1/time-slots             - Create single slot (Admin)

# POST   /api/v1/time-slots/bulk        - Create multiple slots (Admin)

# GET    /api/v1/time-slots             - Get all slots (Public)

# GET    /api/v1/time-slots/available   - Get available slots (Public)

# DELETE /api/v1/time-slots/:id         - Delete slot (Admin)

# ```

# 

# \### Appointments

# ```

# POST   /api/v1/appointments                    - Book appointment (Customer)

# GET    /api/v1/appointments/my-appointments    - Get my appointments (Customer)

# GET    /api/v1/appointments/stylist/:stylistId - Get stylist appointments (Stylist/Admin)

# GET    /api/v1/appointments                    - Get all appointments (Admin)

# GET    /api/v1/appointments/:id                - Get appointment by ID

# PATCH  /api/v1/appointments/:id/cancel         - Cancel appointment (Customer/Admin)

# PATCH  /api/v1/appointments/:id/status         - Update status (Admin)

# ```

# 

# \## Admin Credentials

# ```

# Email: admin@salon.com

# Password: Admin123

# ```

# 

# \## Local Setup Instructions

# 

# \### Prerequisites

# \- Node.js (v18 or higher)

# \- MongoDB (local or Atlas)

# \- npm or yarn

# 

# \### Installation Steps

# 

# 1\. \*\*Clone the repository\*\*

# ```bash

# git clone <repository-url>

# cd salon-management-system

# ```

# 

# 2\. \*\*Install dependencies\*\*

# ```bash

# npm install

# ```

# 

# 3\. \*\*Configure environment variables\*\*

# Create a `.env` file in the root directory:

# ```env

# NODE\_ENV=development

# PORT=5000

# DATABASE\_URL="mongodb://localhost:27017/salon\_db"

# \# Or for MongoDB Atlas:

# \# DATABASE\_URL="mongodb+srv://username:password@cluster.mongodb.net/salon\_db"

# 

# JWT\_SECRET=your\_super\_secret\_jwt\_key\_here

# EXPIRES\_IN=7d

# BCRYPT\_SALT\_ROUNDS=12

# ```

# 

# 4\. \*\*Generate Prisma Client\*\*

# ```bash

# npx prisma generate

# ```

# 

# 5\. \*\*Push schema to database\*\*

# ```bash

# npx prisma db push

# ```

# 

# 6\. \*\*Start the server\*\*

# ```bash

# \# Development mode

# npm run dev

# 

# \# Production mode

# npm run build

# npm start

# ```

# 

# The server will start on `http://localhost:5000`

# 

# \## Testing Instructions

# 

# \### 1. Admin Login

# ```bash

# POST http://localhost:5000/api/v1/auth/login

# Content-Type: application/json

# 

# {

# &nbsp; "email": "admin@salon.com",

# &nbsp; "password": "Admin123"

# }

# ```

# \*\*Save the `accessToken` from response\*\*

# 

# \### 2. Create a Stylist (Admin)

# ```bash

# POST http://localhost:5000/api/v1/stylists

# Authorization: <admin\_token>

# Content-Type: application/json

# 

# {

# &nbsp; "fullName": "Jane Smith",

# &nbsp; "email": "jane@salon.com",

# &nbsp; "password": "password123",

# &nbsp; "phoneNumber": "+1234567891",

# &nbsp; "bio": "Professional hairstylist with 5 years experience",

# &nbsp; "specialization": \["Haircut", "Coloring", "Styling"],

# &nbsp; "experience": 5

# }

# ```

# 

# \### 3. Create a Service (Admin)

# ```bash

# POST http://localhost:5000/api/v1/services

# Authorization: <admin\_token>

# Content-Type: application/json

# 

# {

# &nbsp; "name": "Haircut",

# &nbsp; "description": "Professional haircut service",

# &nbsp; "price": 50,

# &nbsp; "stylistId": "<stylist\_id\_from\_step\_2>"

# }

# ```

# 

# \### 4. Create Time Slots (Admin)

# ```bash

# POST http://localhost:5000/api/v1/time-slots/bulk

# Authorization: <admin\_token>

# Content-Type: application/json

# 

# {

# &nbsp; "stylistId": "<stylist\_id>",

# &nbsp; "date": "2026-01-25",

# &nbsp; "slots": \[

# &nbsp;   { "startTime": "09:00", "endTime": "10:00" },

# &nbsp;   { "startTime": "10:00", "endTime": "11:00" },

# &nbsp;   { "startTime": "11:00", "endTime": "12:00" },

# &nbsp;   { "startTime": "14:00", "endTime": "15:00" }

# &nbsp; ]

# }

# ```

# 

# \### 5. Register as Customer

# ```bash

# POST http://localhost:5000/api/v1/auth/register

# Content-Type: application/json

# 

# {

# &nbsp; "fullName": "John Doe",

# &nbsp; "email": "john@example.com",

# &nbsp; "password": "password123",

# &nbsp; "phoneNumber": "+1234567892"

# }

# ```

# 

# \### 6. Customer Login

# ```bash

# POST http://localhost:5000/api/v1/auth/login

# Content-Type: application/json

# 

# {

# &nbsp; "email": "john@example.com",

# &nbsp; "password": "password123"

# }

# ```

# 

# \### 7. Browse Available Services

# ```bash

# GET http://localhost:5000/api/v1/services

# ```

# 

# \### 8. Check Available Slots

# ```bash

# GET http://localhost:5000/api/v1/time-slots/available?stylistId=<stylist\_id>\&date=2026-01-25

# ```

# 

# \### 9. Book Appointment (Customer)

# ```bash

# POST http://localhost:5000/api/v1/appointments

# Authorization: <customer\_token>

# Content-Type: application/json

# 

# {

# &nbsp; "stylistId": "<stylist\_id>",

# &nbsp; "serviceId": "<service\_id>",

# &nbsp; "timeSlotId": "<available\_slot\_id>",

# &nbsp; "notes": "Please use organic products"

# }

# ```

# 

# \### 10. View My Appointments

# ```bash

# GET http://localhost:5000/api/v1/appointments/my-appointments

# Authorization: <customer\_token>

# ```

# 

# \### 11. Cancel Appointment (At least 2 hours before)

# ```bash

# PATCH http://localhost:5000/api/v1/appointments/<appointment\_id>/cancel

# Authorization: <customer\_token>

# Content-Type: application/json

# 

# {

# &nbsp; "cancellationReason": "Schedule conflict"

# }

# ```

# 

# \## Error Handling Examples

# 

# \### Validation Error

# ```json

# {

# &nbsp; "success": false,

# &nbsp; "message": "Validation error occurred.",

# &nbsp; "errorDetails": {

# &nbsp;   "field": "email",

# &nbsp;   "message": "Invalid email format"

# &nbsp; }

# }

# ```

# 

# \### Unauthorized Access

# ```json

# {

# &nbsp; "success": false,

# &nbsp; "message": "Unauthorized access.",

# &nbsp; "errorDetails": "You must be an admin to manage stylist profiles."

# }

# ```

# 

# \### Slot Already Booked

# ```json

# {

# &nbsp; "success": false,

# &nbsp; "message": "The selected time slot is already booked for this stylist."

# }

# ```

# 

# \### Daily Limit Reached

# ```json

# {

# &nbsp; "success": false,

# &nbsp; "message": "Daily limit reached: Maximum 8 slots per stylist per day"

# }

# ```

# 

# \## Deployment

# 

# \### Vercel Deployment

# 1\. Install Vercel CLI: `npm i -g vercel`

# 2\. Login: `vercel login`

# 3\. Deploy: `vercel --prod`

# 

# \### Heroku Deployment

# 1\. Create Heroku app: `heroku create salon-app`

# 2\. Set environment variables: `heroku config:set DATABASE\_URL=...`

# 3\. Deploy: `git push heroku main`

# 

# \### Railway Deployment

# 1\. Connect GitHub repository

# 2\. Add environment variables in Railway dashboard

# 3\. Deploy automatically on push

# 

# \## Project Structure

# ```

# salon-management-system/

# ├── prisma/

# │   └── schema.prisma

# ├── src/

# │   ├── app/

# │   │   ├── db/

# │   │   ├── middlewares/

# │   │   ├── modules/

# │   │   │   ├── Auth/

# │   │   │   ├── Stylist/

# │   │   │   ├── Service/

# │   │   │   ├── TimeSlot/

# │   │   │   └── Appointment/

# │   │   └── routes/

# │   ├── config/

# │   ├── errors/

# │   ├── helpers/

# │   ├── interfaces/

# │   └── shared/

# ├── .env

# ├── .gitignore

# ├── package.json

# ├── tsconfig.json

# └── README.md

# ```

# 

# \## Features Implemented

# ✅ JWT-based authentication

# ✅ Role-based access control (Admin, Stylist, Customer)

# ✅ Stylist profile management

# ✅ Service category management

# ✅ Time slot scheduling (max 8 per day)

# ✅ Appointment booking with conflict prevention

# ✅ 2-hour cancellation policy

# ✅ Comprehensive error handling

# ✅ Prisma ORM with MongoDB

# ✅ Modular architecture

# 

# \## License

# MIT

# 

# \## Contributors

# \[Your Name]

# 

# \## Support

# For issues and questions, please create an issue in the GitHub repository.

