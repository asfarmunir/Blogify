"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchBlogs, fetchPopularTags, Blog, PopularTag } from "@/lib/store/features/blogSlice";

// Extended interface for populated blog data from API
interface PopulatedBlog extends Omit<Blog, 'authorId'> {
  authorId?: {
    _id: string;
    name: string;
    email: string;
  } | string;
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  BookOpen,
  Sparkles,
} from "lucide-react";

const BlogCard = ({ blog }: { blog: PopulatedBlog }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  const featuredImage = blog.media && blog.media.length > 0 ? blog.media[0] : null;
  const excerpt = stripHtml(blog.description);

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        {featuredImage ? (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || blog.title}
              width={400}
              height={200}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{typeof blog.authorId === 'object' && blog.authorId && 'name' in blog.authorId ? blog.authorId.name : "Anonymous"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(blog.publishedAt || blog.createdAt || new Date().toISOString())}</span>
          </div>
        </div>

        <Link href={`/blogs/${blog._id}`} className="group">
          <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {blog.title}
          </h2>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {truncateText(excerpt, 120)}
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <Tag className="h-3 w-3" />
                <span>#{tag}</span>
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{Math.ceil(excerpt.split(" ").length / 200)} min read</span>
            </div>
          </div>
          <Link href={`/blogs/${blog._id}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              Read More →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const BlogSkeleton = () => (
  <Card className="border-0 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm overflow-hidden">
    <div className="h-48 bg-muted/50 animate-pulse" />
    <CardHeader className="pb-3">
      <div className="flex items-center space-x-4 mb-3">
        <div className="h-4 bg-muted/50 rounded w-24 animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-20 animate-pulse" />
      </div>
      <div className="h-6 bg-muted/50 rounded w-3/4 animate-pulse" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="h-4 bg-muted/50 rounded animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-4/6 animate-pulse" />
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-muted/50 rounded w-16 animate-pulse" />
        <div className="h-6 bg-muted/50 rounded w-20 animate-pulse" />
      </div>
    </CardContent>
  </Card>
);

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center space-x-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center space-x-1"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const BlogsPage = () => {
  const dispatch = useAppDispatch();
  const { 
    blogs, 
    loading, 
    pagination, 
    popularTags, 
    error 
  } = useAppSelector((state) => state.blog);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBlogsData = useCallback(() => {
    const params: { page: number; limit: number; search?: string; tag?: string } = {
      page: currentPage,
      limit: 12,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (selectedTag) {
      params.tag = selectedTag;
    }

    dispatch(fetchBlogs(params));
  }, [dispatch, currentPage, debouncedSearchTerm, selectedTag]);

  useEffect(() => {
    fetchBlogsData();
  }, [fetchBlogsData]);

  useEffect(() => {
    dispatch(fetchPopularTags(10));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? "" : tag);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/30">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Discover Stories
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of articles, tutorials, and insights from passionate writers around the world.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles, tutorials, insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-12 text-lg border-0 bg-gradient-to-r from-muted/50 to-muted/30 focus:from-muted/80 focus:to-muted/60 transition-all duration-300"
              />
            </div>
          </div>

          {/* Popular Tags */}
          {popularTags && popularTags.length > 0 && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Popular Topics</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {popularTags.map((tagData: PopularTag, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleTagClick(tagData.tag)}
                    className={`inline-flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTag === tagData.tag
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    <span>#{tagData.tag}</span>
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                      {tagData.count}
                    </span>
                  </button>
                ))}
              </div>
              {(searchTerm || selectedTag) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* View Toggle */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center space-x-1"
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex items-center space-x-1"
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {pagination && (
          <div className="mb-6 text-center text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalBlogs)} of{" "}
            {pagination.totalBlogs} articles
            {(searchTerm || selectedTag) && (
              <span>
                {" "}for {searchTerm && `"${searchTerm}"`}
                {searchTerm && selectedTag && " in "}
                {selectedTag && `#${selectedTag}`}
              </span>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Something went wrong
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchBlogsData} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/50 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedTag
                ? "Try adjusting your search criteria or clear the filters."
                : "Be the first to share your story with the community."}
            </p>
            {searchTerm || selectedTag ? (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Link href="/blogs/create">
                <Button>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Write Your First Article
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Blog Grid */}
        {!loading && blogs.length > 0 && (
          <>
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}>
              {blogs.map((blog: PopulatedBlog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
