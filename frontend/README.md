# 💻 Exam Paper System - Frontend

This is the user interface for the Decentralized Exam Paper Leak Prevention System. It allows Teachers to upload papers, Authorities to schedule exams, and Exam Centers to safely print papers.

## 🛠️ Tech Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js (for Blockchain interaction)
- **State**: React Hooks

## 🚀 Setup & Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `frontend` root directory and add:
    ```env
    VITE_PINATA_JWT=your_pinata_jwt_token_here
    ```
    *Note: The contract address and ABI are automatically loaded from `../contracts/deployment-info.json`.*

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will typically run at `http://localhost:5173`.

## 📂 Project Structure
- `src/pages`: Main application pages (TeacherDashboard, ExamCenter, etc.).
- `src/services`: API processing (Pinata IPFS upload).
- `src/utils`: Helper functions.
- `src/contracts`: Contains deployment info (linked from contracts folder).

## 📜 Key Scripts
- `npm run dev`: Start dev server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build.
- `npm run lint`: Run ESLint.
