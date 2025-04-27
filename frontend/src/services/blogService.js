import baseService from './baseService';
const baseService_URL = '/api/v1';

export const blogService = {
  getPosts: async (page = 1, limit = 10, tag, author) => {
    try {
      const params = { page, limit };
      if (tag) params.tag = tag;
      if (author) params.author = author;
      
      const response = await baseService.get(`${baseService_URL}/posts`, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    } 
  },

  getPostById: async (id) => {
    try {
      const response = await baseService.get(`${baseService_URL}/posts/${id}`);
      return response.data.data.post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await baseService.post(`${baseService_URL}/posts`, postData);
      return response.data.data.post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await baseService.put(`${baseService_URL}/posts/${id}`, postData);
      return response.data.data.post;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await baseService.delete(`/${baseService_URL}/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  toggleLikePost: async (id) => {
    try {
      const response = await baseService.post(`/${baseService_URL}/posts/${id}/like`);
      return response.data.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  getUserPosts: async (page = 1, limit = 10, status) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      
      const response = await baseService.get(`${baseService_URL}/posts/user/me`, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  getPostComments: async (postId, page = 1, limit = 10) => {
    try {
      const response = await baseService.get(`${baseService_URL}/comments/post/${postId}`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  createComment: async (postId, content, parentId = null) => {
    try {
      const commentData = { content };
      if (parentId) commentData.parentId = parentId;
      
      const response = await baseService.post(`${baseService_URL}/comments/post/${postId}`, commentData);
      return response.data.data.comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  getCommentReplies: async (commentId, page = 1, limit = 10) => {
    try {
      const response = await baseService.get(`${baseService_URL}/comments/${commentId}/replies`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  },

  updateComment: async (commentId, content) => {
    try {
      const response = await baseService.put(`${baseService_URL}/comments/${commentId}`, { content });
      return response.data.data.comment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await baseService.delete(`${baseService_URL}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  toggleLikeComment: async (commentId) => {
    try {
      const response = await baseService.post(`${baseService_URL}/comments/${commentId}/like`);
      return response.data.data;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }
};

export default blogService;