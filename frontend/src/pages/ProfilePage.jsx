import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/slices/authSlice";
import { fetchBlogs } from "../redux/slices/blogSlice";
import { PenSquare, Settings, User } from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    status: authStatus,
  } = useSelector((state) => state.auth);
  const { userPosts = [], status: blogsStatus } = useSelector(
    (state) => state.blogs
  );
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchUserProfile());

    if (blogsStatus === "idle") {
      dispatch(fetchBlogs());
    }
  }, [dispatch, isAuthenticated, navigate, blogsStatus]);

  if (!isAuthenticated) {
    return null; 
  }

  if (authStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">User profile not found.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-green-600 h-32 sm:h-48"></div>
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white overflow-hidden flex items-center justify-center text-gray-700">
                {user.avatar ? (
                  <img
                    className="h-full w-full object-cover"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl sm:text-5xl font-bold bg-gray-200">
                    {user.name
                      ?.split(" ")
                      .filter((word) => word.length > 0)
                      .map((word) => word[0])
                      .filter((_, index) => index === 0 || index === 1) // Only first and second word
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Member since {new Date().getFullYear()}
                </p>
              </div>
              <div className="sm:ml-auto flex space-x-2">
                <Link
                  to="/create-post"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  <PenSquare className="h-4 w-4 mr-2" />
                  Create Post
                </Link>
                <Link
                  to="/settings"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="border-t border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex overflow-x-auto">
                <button className="py-4 px-1 border-b-2 border-green-600 font-medium text-sm text-green-600 whitespace-nowrap">
                  <User className="h-4 w-4 inline mr-2" />
                  My Posts
                </button>
              </div>
            </div>
          </div>

          {/* User's Posts */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {blogsStatus === "loading" ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userPosts.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-5">
                      <Link to={`/blogs/${blog._id}`} className="block mt-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600">
                          {blog.title}
                        </h3>
                        <p className="mt-3 text-sm text-gray-500 line-clamp-3">
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
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-500 flex items-center">
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
                          <span className="text-xs text-gray-500 flex items-center">
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
                            {blog?.comments?.length}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(blog?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  You haven't created any posts yet.
                </p>
                <Link
                  to="/create-post"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
