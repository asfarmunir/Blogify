"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getUserBlogs, deleteBlog } from "@/lib/store/features/blogSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Heart,
  AlertTriangle,
  FileText,
  Clock,
} from "lucide-react";

interface Blog {
  _id?: string;
  title: string;
  description: string;
  media: Array<{ url: string; alt: string }>;
  tags: string[];
  authorId?: string | { _id: string; name: string; email: string };
  isPublished: boolean;
  publishedAt?: string;
  likes: string[];
  createdAt?: string;
  updatedAt?: string;
}

const MyBlogsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userBlogs, loadingUserBlogs, userBlogsPagination, deleting } =
    useAppSelector((state) => state.blog);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const fetchUserBlogs = React.useCallback(() => {
    const params: {
      page: number;
      limit: number;
      search?: string;
      published?: boolean;
    } = {
      page: currentPage,
      limit: 12,
    };

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    if (statusFilter === "published") {
      params.published = true;
    } else if (statusFilter === "draft") {
      params.published = false;
    }

    dispatch(getUserBlogs(params));
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    fetchUserBlogs();
  }, [isAuthenticated, router, fetchUserBlogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUserBlogs();
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleEdit = (blogId: string) => {
    router.push(`/${blogId}/edit`);
  };

  const handleView = (blogId: string) => {
    router.push(`/${blogId}`);
  };

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (blogToDelete?._id) {
      await dispatch(deleteBlog(blogToDelete._id));
      setDeleteModalOpen(false);
      setBlogToDelete(null);
      fetchUserBlogs();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExcerpt = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > 150
      ? textContent.substring(0, 150) + "..."
      : textContent;
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loadingUserBlogs && userBlogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="h-12 bg-muted/50 rounded shimmer w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-video bg-muted/50 rounded-lg shimmer" />
                    <div className="space-y-2">
                      <div className="h-6 bg-muted/50 rounded shimmer" />
                      <div className="h-4 bg-muted/50 rounded shimmer w-3/4" />
                      <div className="h-4 bg-muted/50 rounded shimmer w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl 2xl:max-w-[110rem] mx-auto space-y-8">
          <header className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <span>My Blogs</span>
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Manage and organize your blog posts
                </p>
              </div>
              <Button
                onClick={() => router.push("/create")}
                className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-blue-900 hover:from-primary/90 hover:to-blue-800 shadow-lg shadow-primary/25"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Blog</span>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search your blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-card"
                  />
                </div>
              </form>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 glass-card">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blogs</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {userBlogsPagination && (
              <div className="text-sm text-muted-foreground">
                Showing {userBlogs.length} of {userBlogsPagination.totalItems}{" "}
                blogs
              </div>
            )}
          </header>

          {userBlogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  No blogs found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "No blogs match your current filters. Try adjusting your search or filter criteria."
                    : "You haven't created any blogs yet. Start sharing your thoughts with the world!"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button
                    onClick={() => router.push("/create")}
                    className="mt-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Blog
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userBlogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="group glass-card glow-on-hover hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    {blog.media && blog.media.length > 0 ? (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={blog.media[0].url}
                          alt={blog.media[0].alt}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          blog.isPublished
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {getExcerpt(blog.description)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-3 ">
                    <div className="space-y-3">
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                            >
                              <Tag className="h-3 w-3" />
                              <span>#{tag}</span>
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground px-2 py-1">
                              +{blog.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(
                                blog.publishedAt ||
                                  blog.createdAt ||
                                  new Date().toISOString()
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {calculateReadingTime(blog.description)} min
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{blog.likes.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t">
                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(blog._id!)}
                        className="flex items-center space-x-1 text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(blog._id!)}
                          className="flex items-center space-x-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(blog)}
                          className="flex items-center space-x-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {userBlogsPagination && userBlogsPagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 pt-8">
              <Button
                variant="outline"
                disabled={!userBlogsPagination.hasPrevPage}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="glass-card"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {userBlogsPagination.currentPage} of{" "}
                {userBlogsPagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!userBlogsPagination.hasNextPage}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="glass-card"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="border-red-200 dark:border-red-800">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <span>Delete Blog Post</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-4">
              Are you sure you want to delete &quot;
              <strong>{blogToDelete?.title}</strong>&quot;? This action cannot
              be undone and will permanently remove the blog post and all its
              associated data.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBlogsPage;
