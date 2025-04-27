import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/slices/blogSlice";
import { ArrowRight, BookOpen, Zap, Telescope } from "lucide-react";
import BlogLandingPageImage from "../assets/landing_image_01.jpg";

const HomePage = () => {
  const dispatch = useDispatch();
  const { blogs=[], status } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogs());
    }
  }, [dispatch, status]);

  const latestBlogs = blogs.slice(0, 3);

  return (
    <div className="bg-white">
      <div className="relative bg-gradient-to-r from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                <span className="block text-green-600">
                  Olympiad Excellence
                </span>
                <span className="block">Practice & Mastery Platform</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500">
                Comprehensive preparation hub for American Math Competition,
                IOQM, Indian Statistical Institute, Chennai Mathematical
                Institute, UKMT, and STEM competitions worldwide.
              </p>
              <div className="mt-8 flex space-x-4">
                <Link
                  to="/blogs"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Explore Blogs
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden md:block rounded-md border">
              <img
                src={BlogLandingPageImage}
                alt="Olympiad Excellence"
                className="w-full h-auto rounded-lg shadow-xl rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose Our Blog Platform
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Enhance your learning experience with our comprehensive blog
              platform.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Comprehensive Content
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access a wide range of articles covering various topics in
                  mathematics, physics, and computer science.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Interactive Learning
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Engage with the community through comments and likes,
                  enhancing your learning experience.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                  <Telescope size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Expert Insights
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Learn from experienced educators and professionals in the
                  field of competitive mathematics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Blogs Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Latest Blogs
            </h2>
            <Link
              to="/blogs"
              className="text-green-600 hover:text-green-700 flex items-center"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {status === "loading" ? (
              <div className="col-span-3 flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : latestBlogs.length > 0 ? (
              latestBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          blog.author.avatar ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={blog.author.name}
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {blog.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link to={`/blogs/${blog.id}`} className="block mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600">
                        {blog.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {blog.content.substring(0, 150)}...
                      </p>
                    </Link>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {blog.likes}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          {blog.comments.length}
                        </span>
                      </div>
                      <Link
                        to={`/blogs/${blog.id}`}
                        className="text-sm font-medium text-green-600 hover:text-green-700"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">
                  No blogs found. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive deeper?</span>
            <span className="block text-green-100">
              Start your journey today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/blogs"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800"
              >
                Explore blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
