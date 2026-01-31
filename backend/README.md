# ⚙️ Exam Paper System - Backend

The backend service manages authentication, PDF processing, and acts as the bridge between the frontend, encryption logic, and database.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Security**: JWT, Cookie Parser, Cors
- **Ethereum**: Ethers.js (for backend wallet operations)

## 🚀 Setup & Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` root directory and add:
    ```env
    PORT=5000                   # Optional, default is 5000
    MONGO_URI=mongodb://localhost:27017/chainseal # Or your Atlas URI
    # Add other secrets here (e.g. JWT_SECRET if used)
    ```

4.  **Start the Server:**
    ```bash
    node server.js
    ```
    # Or if utilizing nodemon for development:
    ```bash
    npx nodemon server.js
    ```

## 📡 API Overview
The server exposes endpoints primarily for:
- **Authentication**: `/api/auth` (Login/Register)
- **Status**: `/` (Health check)

## 🗄️ Database
The system uses **MongoDB** to store user roles and metadata. It does **NOT** store the exam papers or their encryption keys.

## ⚠️ Important Note
This backend is stateless regarding the encryption keys. It facilitates the flow but ensures the **Zero-Trust** architecture by not saving keys to the database.
