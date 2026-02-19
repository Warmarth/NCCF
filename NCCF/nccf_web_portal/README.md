# 🇳🇬 NCCF Portal - Platform 2.0

![NCCF Portal](https://raw.githubusercontent.com/username/project/main/public/banner.png) <!-- Note: Replace with actual banner if available -->

> **United in Service, Excellence in Living.**

The official digital portal for the **Nigeria Christian Corpers' Fellowship (NCCF)**. This platform streamlines room allocations, payment verifications, and community management, providing a unified space for all Christian Corpers.

## ✨ Key Features

### 🔐 Advanced Authentication
- Secure login and registration powered by **Supabase Auth**.
- Role-based access control (Member vs. Admin).
- Automatic redirection for protected routes.

### 🏠 Room Management
- **Allocation System:** Transparent room assignment based on verified status.
- **Room Explorer:** Browse available hostels and view room members.
- **Unified Space:** Dedicated sections for community discussion and stay management.

### 💳 Payment Verification
- **Digital Receipts:** Upload payment proofs (images/PDFs) directly to Supabase Storage.
- **Fast-Track Processing:** Real-time submission status tracking.
- **Admin Review:** Dedicated interface for admins to verify or reject transactions.

### 📊 Admin Dashboard
- **Centralized Control:** Manage rooms, users, and verification requests from a single interface.
- **User Directory:** Search and manage member profiles.
- **Analytics:** High-level overview of revenue, occupancy, and registration stats.
- **Promotion System:** Easily elevate members to admin status.

### 👤 Member Profiles
- Customizable profiles with avatars, bios, and batch information.
- State code and location tracking.

## 🛠 Tech Stack

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** Premium Vanilla CSS (Glassmorphism & Dark Mode)
- **Backend:** [Supabase](https://supabase.com/) (Database, Auth, Storage)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Routing:** [React Router 7](https://reactrouter.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest stable version)
- npm or yarn
- A Supabase Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nccf-portal.git
   cd nccf-portal/my-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Navbar, Header, Footer, etc.)
├── hook/           # Custom React hooks (AuthContext)
├── lib/            # External library configurations (Supabase client)
├── pages/          # Individual page components (Login, Admin, Dashboard, etc.)
├── layout.tsx      # Main application layout
├── App.tsx         # Routing and high-level logic
└── main.tsx        # Entry point
```

## 🛡 Security & Maintenance
- **Memory Safety:** Implemented `isMounted` guards and object URL cleanup to prevent memory leaks during long sessions.
- **Scalability:** Built on a serverless architecture for high availability.

---

© 2026 Nigeria Christian Corpers' Fellowship. Simple. Unique. Unified.
