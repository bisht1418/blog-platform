// src/redux/slices/blogSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogService } from '../../services/blogService';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async ({ page = 1, limit = 10, tag, author } = {}, { rejectWithValue }) => {
    try {
      return await blogService.getPosts(page, limit, tag, author);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      // This is an alternate name for fetchPosts without pagination/filtering
      // for backward compatibility with your existing code
      return await blogService.getPosts(1, 100);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'blog/fetchPostById',
  async (id, { rejectWithValue }) => {
    try {
      return await blogService.getPostById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      return await blogService.createPost(postData);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      return await blogService.updatePost(id, postData);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await blogService.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  'blog/toggleLikePost',
  async (id, { rejectWithValue }) => {
    try {
      const result = await blogService.toggleLikePost(id);
      return { id, ...result };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'blog/fetchUserPosts',
  async ({ page = 1, limit = 10, status } = {}, { rejectWithValue }) => {
    try {
      return await blogService.getUserPosts(page, limit, status);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPostComments = createAsyncThunk(
  'blog/fetchPostComments',
  async ({ postId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      return await blogService.getPostComments(postId, page, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createComment = createAsyncThunk(
  'blog/createComment',
  async ({ postId, content, parentId }, { rejectWithValue }) => {
    try {
      const comment = await blogService.createComment(postId, content, parentId);
      return { postId, comment };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateComment = createAsyncThunk(
  'blog/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const comment = await blogService.updateComment(commentId, content);
      return comment;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteComment = createAsyncThunk(
  'blog/deleteComment',
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      await blogService.deleteComment(commentId);
      return { commentId, postId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const toggleLikeComment = createAsyncThunk(
  'blog/toggleLikeComment',
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      const result = await blogService.toggleLikeComment(commentId);
      return { commentId, postId, ...result };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchCommentReplies = createAsyncThunk(
  'blog/fetchCommentReplies',
  async ({ commentId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await blogService.getCommentReplies(commentId, page, limit);
      return { commentId, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  allPosts: [], // Unfiltered list of posts
  filteredPosts: [], // Filtered list of posts
  activeFilters: {
    tag: null,
    author: null,
    searchQuery: '',
  },
  blogs: [],
  currentPost: null,
  userPosts: [],
  comments: {},
  pagination: {
    posts: { total: 0, page: 1, limit: 10, pages: 1 },
    userPosts: { total: 0, page: 1, limit: 10, pages: 1 },
    comments: {}, // Will store pagination for each post's comments
    replies: {}, // Will store pagination for each comment's replies
  },
  loading: false,
  error: null,
};

// Create slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    filterByTag: (state, action) => {
      state.activeFilters.tag = action.payload;
      if (action.payload) {
        state.filteredPosts = state.allPosts.filter(post =>
          post.tags && post.tags.includes(action.payload)
        );
      } else {
        state.filteredPosts = [...state.allPosts];
      }
    },
    filterByAuthor: (state, action) => {
      state.activeFilters.author = action.payload;
      if (action.payload) {
        state.filteredPosts = state.allPosts.filter(post =>
          post.author && post.author._id === action.payload
        );
      } else {
        state.filteredPosts = [...state.allPosts];
      }
    },
    searchPosts: (state, action) => {
      state.activeFilters.searchQuery = action.payload;
      if (action.payload) {
        const query = action.payload.toLowerCase();
        state.filteredPosts = state.allPosts.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      } else {
        state.filteredPosts = [...state.allPosts];
      }
    },
    clearFilters: (state) => {
      state.activeFilters = {
        tag: null,
        author: null,
        searchQuery: '',
      };
      state.filteredPosts = [...state.allPosts];
    },
    applyFilters: (state) => {
      let filtered = [...state.allPosts];

      // Apply tag filter
      if (state.activeFilters.tag) {
        filtered = filtered.filter(post =>
          post.tags && post.tags.includes(state.activeFilters.tag)
        );
      }

      // Apply author filter
      if (state.activeFilters.author) {
        filtered = filtered.filter(post =>
          post.author && post.author._id === state.activeFilters.author
        );
      }

      // Apply search filter
      if (state.activeFilters.searchQuery) {
        const query = state.activeFilters.searchQuery.toLowerCase();
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }

      state.filteredPosts = filtered;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination.posts = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to fetch posts' };
      })

      // Handle fetchBlogs (alias for fetchPosts)
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosts = action.payload.posts;
        state.filteredPosts = action.payload.posts;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to fetch blogs' };
      })

      // Handle fetchPostById
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
        // Initialize comments if they exist in the response
        if (action.payload.comments) {
          state.comments[action.payload._id] = action.payload.comments;
        }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to fetch post' };
      })

      // Handle createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        // Add to various post arrays
        state.posts.unshift(action.payload);
        state.userPosts.unshift(action.payload);
        state.allPosts.unshift(action.payload);

        // Re-apply any active filters
        if (state.activeFilters.tag || state.activeFilters.author || state.activeFilters.searchQuery) {
          // Use the applyFilters logic
          let filtered = [...state.allPosts];

          if (state.activeFilters.tag) {
            filtered = filtered.filter(post =>
              post.tags && post.tags.includes(state.activeFilters.tag)
            );
          }

          if (state.activeFilters.author) {
            filtered = filtered.filter(post =>
              post.author && post.author._id === state.activeFilters.author
            );
          }

          if (state.activeFilters.searchQuery) {
            const query = state.activeFilters.searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
              post.title.toLowerCase().includes(query) ||
              post.content.toLowerCase().includes(query) ||
              (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
            );
          }

          state.filteredPosts = filtered;
        } else {
          state.filteredPosts.unshift(action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to create post' };
      })

      // Handle updatePost
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload;

        // Update in posts array
        const index = state.posts.findIndex(post => post._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }

        // Update in userPosts array
        const userIndex = state.userPosts.findIndex(post => post._id === updatedPost._id);
        if (userIndex !== -1) {
          state.userPosts[userIndex] = updatedPost;
        }

        // Update in allPosts array
        const allIndex = state.allPosts.findIndex(post => post._id === updatedPost._id);
        if (allIndex !== -1) {
          state.allPosts[allIndex] = updatedPost;
        }

        // Update in filteredPosts array
        const filteredIndex = state.filteredPosts.findIndex(post => post._id === updatedPost._id);
        if (filteredIndex !== -1) {
          state.filteredPosts[filteredIndex] = updatedPost;
        }

        // Update currentPost if it's the same post
        if (state.currentPost && state.currentPost._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to update post' };
      })

      // Handle deletePost
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        const postId = action.payload;

        // Remove from all post arrays
        state.posts = state.posts.filter(post => post._id !== postId);
        state.userPosts = state.userPosts.filter(post => post._id !== postId);
        state.allPosts = state.allPosts.filter(post => post._id !== postId);
        state.filteredPosts = state.filteredPosts.filter(post => post._id !== postId);

        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to delete post' };
      })

      // Handle toggleLikePost
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { id, liked, likeCount } = action.payload;

        // Update in all post arrays
        const updateLikeCount = (postsArray) => {
          const idx = postsArray.findIndex(post => post._id === id);
          if (idx !== -1) {
            postsArray[idx].likeCount = likeCount;
          }
        };

        updateLikeCount(state.posts);
        updateLikeCount(state.userPosts);
        updateLikeCount(state.allPosts);
        updateLikeCount(state.filteredPosts);

        // Update currentPost if it's the same post
        if (state.currentPost && state.currentPost._id === id) {
          state.currentPost.likeCount = likeCount;
        }
      })

      // Handle fetchUserPosts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload.posts;
        state.pagination.userPosts = action.payload.pagination;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to fetch user posts' };
      })

      // Handle fetchPostComments
      .addCase(fetchPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.loading = false;
        const { postId } = action.meta.arg;
        state.comments[postId] = action.payload.comments;
        state.pagination.comments[postId] = action.payload.pagination;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to fetch comments' };
      })

      // Handle createComment
      .addCase(createComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;

        // If this is a top-level comment
        if (!comment.parent) {
          if (!state.comments[postId]) {
            state.comments[postId] = [];
          }
          state.comments[postId].unshift(comment);

          // Increment comment count on the current post if it exists
          if (state.currentPost && state.currentPost._id === postId) {
            state.currentPost.commentCount = (state.currentPost.commentCount || 0) + 1;
          }

          // Update comment count in post lists
          const updateCommentCount = (postsArray) => {
            const idx = postsArray.findIndex(post => post._id === postId);
            if (idx !== -1) {
              postsArray[idx].commentCount = (postsArray[idx].commentCount || 0) + 1;
            }
          };

          updateCommentCount(state.posts);
          updateCommentCount(state.userPosts);
          updateCommentCount(state.allPosts);
          updateCommentCount(state.filteredPosts);
        }
        // If this is a reply
        else {
          const parentId = comment.parent;
          // Find the parent comment
          if (state.comments[postId]) {
            const parentComment = state.comments[postId].find(c => c._id === parentId);
            if (parentComment) {
              if (!parentComment.replies) {
                parentComment.replies = [];
              }
              parentComment.replies.push(comment);
            }
          }
        }
      })

      // Handle updateComment
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const postId = updatedComment.post;

        // Update in comments array if it's a top-level comment
        if (!updatedComment.parent && state.comments[postId]) {
          const index = state.comments[postId].findIndex(comment => comment._id === updatedComment._id);
          if (index !== -1) {
            state.comments[postId][index] = updatedComment;
          }
        }
        // Update in replies if it's a reply
        else if (updatedComment.parent && state.comments[postId]) {
          const parentComment = state.comments[postId].find(comment => comment._id === updatedComment.parent);
          if (parentComment && parentComment.replies) {
            const replyIndex = parentComment.replies.findIndex(reply => reply._id === updatedComment._id);
            if (replyIndex !== -1) {
              parentComment.replies[replyIndex] = updatedComment;
            }
          }
        }
      })

      // Handle deleteComment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, postId } = action.payload;

        // Remove from comments array if it exists
        if (state.comments[postId]) {
          // If it's a top-level comment
          const commentIndex = state.comments[postId].findIndex(comment => comment._id === commentId);
          if (commentIndex !== -1) {
            state.comments[postId].splice(commentIndex, 1);

            // Decrement comment count on the current post if it exists
            if (state.currentPost && state.currentPost._id === postId) {
              state.currentPost.commentCount = Math.max(0, (state.currentPost.commentCount || 0) - 1);
            }

            // Update comment count in post lists
            const updateCommentCount = (postsArray) => {
              const idx = postsArray.findIndex(post => post._id === postId);
              if (idx !== -1) {
                postsArray[idx].commentCount = Math.max(0, (postsArray[idx].commentCount || 0) - 1);
              }
            };

            updateCommentCount(state.posts);
            updateCommentCount(state.userPosts);
            updateCommentCount(state.allPosts);
            updateCommentCount(state.filteredPosts);
          }
          // Check if it's a reply and remove it
          else {
            for (const comment of state.comments[postId]) {
              if (comment.replies) {
                const replyIndex = comment.replies.findIndex(reply => reply._id === commentId);
                if (replyIndex !== -1) {
                  comment.replies.splice(replyIndex, 1);
                  break;
                }
              }
            }
          }
        }
      })

      // Handle toggleLikeComment
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const { commentId, postId, liked, likeCount } = action.payload;

        // Update like count in comments
        if (state.comments[postId]) {
          // Check if it's a top-level comment
          const comment = state.comments[postId].find(c => c._id === commentId);
          if (comment) {
            comment.likeCount = likeCount;
          }
          // Check if it's a reply
          else {
            for (const parentComment of state.comments[postId]) {
              if (parentComment.replies) {
                const reply = parentComment.replies.find(r => r._id === commentId);
                if (reply) {
                  reply.likeCount = likeCount;
                  break;
                }
              }
            }
          }
        }
      })

      // Handle fetchCommentReplies
      .addCase(fetchCommentReplies.fulfilled, (state, action) => {
        const { commentId, replies, pagination } = action.payload;

        // Find the comment and update its replies
        for (const postId in state.comments) {
          const comment = state.comments[postId].find(c => c._id === commentId);
          if (comment) {
            comment.replies = replies;
            // Store pagination data
            if (!state.pagination.replies[commentId]) {
              state.pagination.replies[commentId] = {};
            }
            state.pagination.replies[commentId] = pagination;
            break;
          }
        }
      });
  },
});

export const {
  clearCurrentPost,
  clearError,
  filterByTag,
  filterByAuthor,
  searchPosts,
  clearFilters,
  applyFilters
} = blogSlice.actions;

export default blogSlice.reducer;