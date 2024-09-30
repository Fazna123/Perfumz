# Perfumz - Perfume Shop Management App

**Perfumz** is a comprehensive perfume shop management application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The app allows users to manage products, inventory, sales, and clients with ease, providing a seamless experience for admin.

---

## Features

- **User Authentication:** Secure login and signup using JWT for token-based authentication.
- **Product Management:** Add, update, and delete products in the shop's inventory.
- **Inventory Management:** Track stock levels and update inventory accordingly.
- **Client Management:** Manage customer details and orders.
- **Sales Management:** Keep track of sales and generate reports.

---

## Tech Stack

### Frontend:

- **React.js** (with React Router for navigation)
- **Tailwind CSS** (for styling)

### Backend:

- **Node.js**
- **Express.js** (REST API framework)
- **MongoDB** (Database)
- **JWT** (for authentication)

---

## Installation

### Prerequisites

- **Node.js**: You need to have Node.js installed on your system.
- **MongoDB**: A MongoDB instance is required, either locally or using a cloud service like MongoDB Atlas.

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Fazna123/Perfumz.git
   cd perfumz
   ```

2. **Install Dependencies**

   Install dependencies for both the frontend and backend.

   **Backend:**
   ```bash
   cd backend
   npm install
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the `backend` folder and fill it with the following variables:

   ```bash
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET_KEY=jwt-secret-string
   PORT=3000
   ```

4. **Run the Application**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run at `http://localhost:5173`, and the backend will run at `http://localhost:3000`.
