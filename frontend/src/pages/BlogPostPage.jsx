import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  createComment,
  toggleLikePost,
  deletePost,
} from "../redux/slices/blogSlice";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

const BlogPostPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost=[], status, error } = useSelector((state) => state.blogs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() && isAuthenticated) {
      dispatch(
        createComment({
          postId: id,
          content: commentText,
        })
      );
      setCommentText("");
    }
  };

  const handleLike = () => {
    if (isAuthenticated) {
      dispatch(toggleLikePost(id));
    }
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePost(id)).then(() => {
      navigate("/blogs");
    });
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showConfirm]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
              <p className="mt-2 text-sm text-red-700">
                <Link to="/blogs" className="font-medium underline">
                  Go back to blogs
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">Blog post not found.</p>
          <Link
            to="/blogs"
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor =
    isAuthenticated && user && currentPost.author._id === user._id;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/blogs"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to blogs
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-[3rem] w-[3rem]  rounded-full border-1 border-white bg-white overflow-hidden flex items-center justify-center text-gray-700">
                  <div className="h-full w-full flex items-center justify-center  font-bold bg-gray-200">
                    {currentPost.author.name
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
                    {currentPost.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(currentPost.createdAt).toLocaleDateString()} •{" "}
                    {new Date(currentPost.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {isAuthor && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <Link
                          to={`/edit-blog/${currentPost._id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit post
                        </Link>
                        <button
                          onClick={handleDeleteClick}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentPost.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {currentPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {currentPost.content}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 text-sm ${
                      isAuthenticated
                        ? "text-gray-500 hover:text-green-600"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isAuthenticated}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isAuthenticated
                          ? "text-gray-500 hover:text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{currentPost?.likes}</span>
                  </button>

                  <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600">
                    <MessageCircle className="h-5 w-5" />
                    <span>{currentPost?.comments?.length}</span>
                  </button>

                  {/* <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button> */}
                </div>

                {/* <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600">
                  <Bookmark className="h-5 w-5" />
                  <span>Save</span>
                </button> */}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Comments ({currentPost?.comments?.length})
            </h2>

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex items-start space-x-4">
                  <div className="h-[3rem] w-[3rem]  rounded-full border-1 border-white bg-white overflow-hidden flex items-center justify-center text-gray-700">
                    <div className="h-full w-full flex items-center justify-center  font-bold bg-gray-200">
                      {user.name
                        ?.split(" ")
                        .filter((word) => word.length > 0)
                        .map((word) => word[0])
                        .filter((_, index) => index === 0 || index === 1)
                        .join("")
                        .toUpperCase()}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                      <textarea
                        rows={3}
                        name="comment"
                        id="comment"
                        className="block w-full py-3 px-4 border-0 resize-none focus:ring-0 sm:text-sm"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        disabled={!commentText.trim()}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Please{" "}
                      <Link to="/login" className="font-medium underline">
                        sign in
                      </Link>{" "}
                      to leave a comment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentPost?.comments?.length > 0 ? (
              <div className="space-y-6">
                {currentPost?.comments?.map((comment) => (
                  <div key={comment._id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-[3rem] w-[3rem]  rounded-full border-1 border-white bg-white overflow-hidden flex items-center justify-center text-gray-700">
                        <div className="h-full w-full flex items-center justify-center  font-bold bg-gray-200">
                          {comment?.author?.name
                            ?.split(" ")
                            .filter((word) => word?.length > 0)
                            .map((word) => word[0])
                            .filter((_, index) => index === 0 || index === 1)
                            .join("")
                            .toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {comment.author.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">
                          {comment.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 ml-2">
                        <button className="text-xs text-gray-500 hover:text-green-600">
                          Like
                        </button>
                        <button className="text-xs text-gray-500 hover:text-green-600">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </article>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
      />
    </div>
  );
};

export default BlogPostPage;
