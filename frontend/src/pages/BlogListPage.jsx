import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/slices/blogSlice";
import { Search, Filter, X } from "lucide-react";

const BlogListPage = () => {
  const dispatch = useDispatch();
  const {
    allPosts = [],
    status = "idle",
    filteredTags = [],
  } = useSelector((state) => state.blogs || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogs());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (Array.isArray(allPosts) && allPosts.length > 0) {
      const tags = [...new Set(allPosts.flatMap((blog) => blog.tags || []))];
      setAvailableTags(tags);
    }
  }, [allPosts]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagFilter = (tag) => {
    if (filteredTags?.includes(tag)) {
      // dispatch(filterByTag(filteredTags.filter((t) => t !== tag)))
    } else {
      // dispatch(filterByTag([...filteredTags, tag]))
    }
  };

  const handleClearFilters = () => {
    // dispatch(clearFilters())
    setSearchTerm("");
  };

  const filteredBlogs = (allPosts || []).filter((blog) => {
    const matchesSearch =
      searchTerm === "" ||
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags =
      (filteredTags || []).length === 0 ||
      (filteredTags || []).every((tag) => blog.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Blog Posts
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Explore our collection of articles on mathematics, physics, and
            competitive programming.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search allPosts..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700 mr-2">
                Filter by tags:
              </span>
              <div className="flex flex-wrap gap-2">
                {(availableTags || []).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      filteredTags?.includes(tag)
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {(filteredTags?.length > 0 || searchTerm) && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Blog List */}
        {status === "loading" ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-[3rem] w-[3rem]  rounded-full border-1 border-white bg-white overflow-hidden flex items-center justify-center text-gray-700">
                      <div className="h-full w-full flex items-center justify-center  font-bold bg-gray-200">
                        {blog.author.name
                          ?.split(" ")
                          .filter((word) => word.length > 0)
                          .map((word) => word[0])
                          .filter((_, index) => index === 0 || index === 1) 
                          .join("")
                          .toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {blog.author.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link to={`/blogs/${blog._id}`} className="block mt-2">
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
                        {blog?.likes}
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
                        {blog?.comments?.length}
                      </span>
                    </div>
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">
              No allPosts found matching your criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
