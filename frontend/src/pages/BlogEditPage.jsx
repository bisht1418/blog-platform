"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchPostById, updatePost } from "../redux/slices/blogSlice"
import { ArrowLeft, Save } from "lucide-react"

const BlogEditPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentPost, status, error } = useSelector((state) => state.blogs)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchPostById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (currentPost) {
      setFormData({
        title: currentPost.title || "",
        content: currentPost.content || "",
        tags: currentPost.tags ? currentPost.tags.join(", ") : "",
      })
    }
  }, [currentPost])

  useEffect(() => {
    // Redirect if not authenticated or not the author
    if (currentPost && isAuthenticated && user) {
      if (currentPost.author._id !== user._id) {
        navigate(`/blogs/${id}`)
      }
    }
  }, [currentPost, isAuthenticated, user, navigate, id])

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }
    if (!formData.content.trim()) {
      errors.content = "Content is required"
    }
    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    // Process tags from comma-separated string to array
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    dispatch(
      updatePost({
        id,
        postData: {
          title: formData.title,
          content: formData.content,
          tags: tagsArray,
        },
      }),
    ).then((result) => {
      setIsSubmitting(false)
      if (!result.error) {
        navigate(`/blogs/${id}`)
      }
    })
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
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
    )
  }

  if (!currentPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">Blog post not found.</p>
          <Link to="/blogs" className="mt-4 inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <Link to={`/blogs/${id}`} className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to post
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                    formErrors.title ? "border-red-300" : ""
                  }`}
                  placeholder="Enter post title"
                />
                {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
              </div>

              {/* Content Field */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                    formErrors.content ? "border-red-300" : ""
                  }`}
                  placeholder="Write your post content here..."
                />
                {formErrors.content && <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>}
              </div>

              {/* Tags Field */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  placeholder="technology, programming, web development"
                />
                <p className="mt-1 text-xs text-gray-500">Separate tags with commas (e.g., technology, programming)</p>
              </div>

              {/* Preview of Tags */}
              {formData.tags && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Tag Preview:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0)
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BlogEditPage
