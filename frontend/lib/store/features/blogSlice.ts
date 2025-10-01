import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface BlogMedia {
  url: string;
  alt: string;
}

export interface Blog {
  _id?: string;
  title: string;
  description: string;
  media: BlogMedia[];
  tags: string[];
  authorId?: string;
  isPublished: boolean;
  publishedAt?: string;
  likes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogFilters {
  search: string | null;
  tag: string | null;
}

export interface PopularTag {
  tag: string;
  count: number;
}

export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  uploadingImages: boolean;
  error: string | null;
  pagination: BlogPagination | null;
  filters: BlogFilters | null;
  popularTags: PopularTag[];
  loadingTags: boolean;
}

// Cloudinary upload function
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "leasebuddi");
  data.append("cloud_name", "unionwealthmanagement");

  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/unionwealthmanagement/image/upload",
    data
  );

  return response.data.secure_url;
};

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Async Thunks
export const uploadImages = createAsyncThunk(
  'blog/uploadImages',
  async (files: File[], { rejectWithValue }) => {
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      
      return urls.map((url, index) => ({
        url,
        alt: files[index].name
      }));
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to upload images');
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData: Omit<Blog, '_id' | 'authorId' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE}/blogs`,
        blogData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error 
        ? (error as { response: { data: { message: string } } }).response?.data?.message
        : 'Failed to create blog';
      return rejectWithValue(message);
    }
  }
);

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (params: { page?: number; limit?: number; search?: string; tag?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.tag) queryParams.append('tag', params.tag);

      const response = await axios.get(`${API_BASE}/blogs?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error 
        ? (error as { response: { data: { message: string } } }).response?.data?.message
        : 'Failed to fetch blogs';
      return rejectWithValue(message);
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blog/fetchBlogById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/blogs/${id}`);
      return response.data.data;
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error 
        ? (error as { response: { data: { message: string } } }).response?.data?.message
        : 'Failed to fetch blog';
      return rejectWithValue(message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, updates }: { id: string; updates: Partial<Blog> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE}/blogs/${id}`,
        updates,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error 
        ? (error as { response: { data: { message: string } } }).response?.data?.message
        : 'Failed to update blog';
      return rejectWithValue(message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return id;
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error 
        ? (error as { response: { data: { message: string } } }).response?.data?.message
        : 'Failed to delete blog';
      return rejectWithValue(message);
    }
  }
);

export const fetchPopularTags = createAsyncThunk(
  'blog/fetchPopularTags',
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/blogs/tags/popular?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error 
        ? (error as { response: { data: { message: string } } }).response?.data?.message
        : 'Failed to fetch popular tags';
      return rejectWithValue(message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'blog/toggleLike',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE}/blogs/${id}/like`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error 
        ? (error as { response: { data: { message: string } } }).response?.data?.message
        : 'Failed to toggle like';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  uploadingImages: false,
  error: null,
  pagination: null,
  filters: null,
  popularTags: [],
  loadingTags: false,
};

// Slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    setCurrentBlog: (state, action: PayloadAction<Blog>) => {
      state.currentBlog = action.payload;
    },
    resetBlogState: (state) => {
      state.blogs = [];
      state.currentBlog = null;
      state.error = null;
      state.pagination = null;
      state.filters = null;
    }
  },
  extraReducers: (builder) => {
    // Upload Images
    builder
      .addCase(uploadImages.pending, (state) => {
        state.uploadingImages = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state) => {
        state.uploadingImages = false;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.uploadingImages = false;
        state.error = action.payload as string;
      });

    // Create Blog
    builder
      .addCase(createBlog.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.creating = false;
        state.blogs.unshift(action.payload);
        if (state.pagination) {
          state.pagination.totalBlogs += 1;
        }
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      });

    // Fetch Blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data || action.payload;
        state.pagination = action.payload.pagination || null;
        state.filters = action.payload.filters || null;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Blog By ID
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Blog
    builder
      .addCase(updateBlog.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if (state.currentBlog && state.currentBlog._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Delete Blog
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.deleting = false;
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        if (state.currentBlog && state.currentBlog._id === action.payload) {
          state.currentBlog = null;
        }
        if (state.pagination) {
          state.pagination.totalBlogs -= 1;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });

    // Toggle Like
    builder
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if (state.currentBlog && state.currentBlog._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Popular Tags
    builder
      .addCase(fetchPopularTags.pending, (state) => {
        state.loadingTags = true;
        state.error = null;
      })
      .addCase(fetchPopularTags.fulfilled, (state, action) => {
        state.loadingTags = false;
        state.popularTags = action.payload;
      })
      .addCase(fetchPopularTags.rejected, (state, action) => {
        state.loadingTags = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentBlog, setCurrentBlog, resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;