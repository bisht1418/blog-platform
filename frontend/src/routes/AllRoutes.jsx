import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import HomePage from "../pages/HomePage";
import BlogListPage from "../pages/BlogListPage";
import BlogPostPage from "../pages/BlogPostPage";
import ProfilePage from "../pages/ProfilePage";
import CreatePostPage from "../pages/CreatePostPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop"; // Import ScrollToTop component
import BlogEditPage from "../pages/BlogEditPage";

const LayoutWithNavbar = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const navbarPages = [
  { path: "/", element: <HomePage /> },
  { path: "/blogs", element: <BlogListPage /> },
  { path: "/blogs/:id", element: <BlogPostPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/create-post", element: <CreatePostPage /> },
  { path: "/edit-blog/:id", element: <BlogEditPage /> },
];

const noNavbarPages = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <NotFound /> },
];

const AllRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      {navbarPages.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<LayoutWithNavbar>{element}</LayoutWithNavbar>}
        />
      ))}
      {noNavbarPages.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<div className="min-h-screen">{element}</div>}
        />
      ))}
    </Routes>
  </>
);

export default AllRoutes;
