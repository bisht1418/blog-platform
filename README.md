# 📝 Blog Platform

A full-stack **MERN Blog Platform** with user authentication, CRUD operations for posts, comments, and likes — built for enhanced interactivity and modern UI/UX.

## 🚀 Live URLs

- **Frontend:** [https://blog-platform-sigma-cyan.vercel.app](https://blog-platform-sigma-cyan.vercel.app)
- **Backend:** [https://blop-post-backend.onrender.com/](https://blop-post-backend.onrender.com/)

---

## 📚 Project Overview

This project involves creating a blog platform where users can:

- Sign up and log in securely (JWT authentication).
- Create, read, update, and delete blog posts.
- View recent posts in reverse chronological order.
- Filter posts by tags for better organization.
- Leave comments and likes on posts for better interactivity.

---

## 🔒 Features

- **User Authentication:**  
  Implemented with **JWT** for session management and secure password storage (bcrypt hashing).

- **CRUD Operations:**  
  Full CRUD functionality for blog posts (Title, Content, Tags).

- **Recent Posts Display:**  
  Posts are shown in reverse chronological order and can be filtered by tags.

- **Comments & Likes (Bonus):**  
  Users can comment on posts and "like" posts to engage with the community.

---

## 🎨 UI Design

- **Theme:**  
  Inspired by the [Panini8 website](#) (theme, color schemes, and design elements for consistency).

- **Suggested UI Components:**
  - **Navbar:** Navigation between Home, Profile, and Create Blog pages.
  - **Blog List Page:** Shows recent posts with filter options.
  - **Blog Post Page:** Displays a post's details, comments section, and a like button.
  - **User Profile Page:** Displays user's posts with profile editing options.

- **Additional UI Requirements:**
  - Consistent typography and spacing.
  - Mobile-friendly responsive design.

---

## ⚙️ Tech Stack and Dependencies

- **Frontend:**  
  - React.js
  - `styled-components` (or similar library) for theming

- **Backend:**  
  - Node.js with Express

- **Database:**  
  - MongoDB (cloud or local)

- **Authentication:**  
  - JSON Web Tokens (JWT)
  - bcrypt for password hashing

- **Other Dependencies:**  
  - Mongoose for MongoDB interactions
  - socket.io (optional) for real-time comments

---

## 🛠️ Getting Started (Local Setup)

1. **Clone the repositories:**

```bash
git clone <frontend-repo-url>
git clone <backend-repo-url>
