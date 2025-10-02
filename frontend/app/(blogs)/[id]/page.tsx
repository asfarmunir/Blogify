"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchBlogById,
  toggleLike,
  deleteBlog,
} from "@/lib/store/features/blogSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Heart,
  Share2,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Sparkles,
  Edit3,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface PopulatedBlog {
  _id?: string;
  title: string;
  description: string;
  media: Array<{ url: string; alt: string }>;
  tags: string[];
  authorId?:
    | {
        _id: string;
        name: string;
        email: string;
      }
    | string;
  isPublished: boolean;
  publishedAt?: string;
  likes: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ url: string; alt: string }>;
  currentIndex: number;
  onImageChange: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onImageChange,
}) => {
  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onImageChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onImageChange(newIndex);
  };

  const handleKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        const newIndex =
          currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        onImageChange(newIndex);
      }
      if (e.key === "ArrowRight") {
        const newIndex =
          currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        onImageChange(newIndex);
      }
      if (e.key === "Escape") onClose();
    },
    [currentIndex, images.length, onClose, onImageChange]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [isOpen, handleKeyPress]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black/95 border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Image Gallery</DialogTitle>
          <DialogDescription>
            Navigate through blog images using arrow keys or buttons
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-[70vh] flex items-center justify-center bg-black">
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            width={1200}
            height={800}
            className="max-w-full max-h-full object-contain"
            priority
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} of {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="p-4 bg-black/90">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => onImageChange(index)}
                  className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? "border-white shadow-lg"
                      : "border-transparent hover:border-white/50"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-white/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ImageGallery: React.FC<{
  images: Array<{ url: string; alt: string }>;
}> = ({ images }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const displayImages = images.slice(0, 5);
  const hasMoreImages = images.length > 5;

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Gallery</span>
          {images.length > 1 && (
            <span className="text-sm text-muted-foreground">
              ({images.length} images)
            </span>
          )}
        </h3>

        <div className="space-y-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
              <Image
                src={displayImages[0].url}
                alt={displayImages[0].alt}
                width={800}
                height={450}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 text-white p-3 rounded-full">
                    <ZoomIn className="h-6 w-6" />
                  </div>
                </div>
              </div>
              {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  1 of {images.length}
                </div>
              )}
            </div>
          </div>

          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {displayImages.slice(1, 5).map((image, index) => (
                <div
                  key={index + 1}
                  className="relative group cursor-pointer aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30"
                  onClick={() => handleImageClick(index + 1)}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-black/50 text-white p-2 rounded-full">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  {index === 3 && hasMoreImages && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-xl font-bold">
                          +{images.length - 5}
                        </div>
                        <div className="text-sm">more</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={images}
        currentIndex={currentImageIndex}
        onImageChange={setCurrentImageIndex}
      />
    </>
  );
};

const BlogDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentBlog, loading, error, deleting } = useAppSelector(
    (state) => state.blog
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  console.log("🚀 ~ BlogDetailsPage ~ user:", user);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const blogId = params.id as string;

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
    }
  }, [dispatch, blogId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleLike = async () => {
    if (isAuthenticated && blogId && !isLiking) {
      setIsLiking(true);
      try {
        await dispatch(toggleLike(blogId));
      } finally {
        setIsLiking(false);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && currentBlog) {
      try {
        await navigator.share({
          title: currentBlog.title,
          text: currentBlog.description
            .replace(/<[^>]*>/g, "")
            .substring(0, 150),
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleEdit = () => {
    router.push(`/${blogId}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (blogId) {
      await dispatch(deleteBlog(blogId));
      setDeleteModalOpen(false);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <div className="h-8 bg-muted/50 rounded shimmer" />
              <div className="h-12 bg-muted/50 rounded shimmer w-3/4" />
              <div className="flex space-x-4">
                <div className="h-4 bg-muted/50 rounded shimmer w-24" />
                <div className="h-4 bg-muted/50 rounded shimmer w-20" />
                <div className="h-4 bg-muted/50 rounded shimmer w-16" />
              </div>
            </div>

            <div className="aspect-video bg-muted/50 rounded-xl shimmer" />

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted/50 rounded shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentBlog) {
    return (
      <div className="min-h-[80svh] bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl text-muted-foreground">404</div>
          <h1 className="text-2xl font-bold text-foreground">Blog Not Found</h1>
          <p className="text-muted-foreground pb-4">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/" className="">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const blog = currentBlog as PopulatedBlog;

  const userId = user
    ? (user as { _id?: string; id?: string })._id ||
      (user as { _id?: string; id?: string }).id ||
      ""
    : "";

  const isLiked =
    user &&
    userId &&
    blog.likes &&
    (blog.likes.includes(userId) ||
      blog.likes.some((like: string | { _id?: string; id?: string }) =>
        typeof like === "object"
          ? like._id === userId || like.id === userId
          : like === userId
      ));

  const readingTime = calculateReadingTime(blog.description);

  const isOwner =
    user &&
    ((typeof blog.authorId === "object" &&
      blog.authorId &&
      "_id" in blog.authorId &&
      blog.authorId._id === userId) ||
      (typeof blog.authorId === "string" && blog.authorId === userId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <header className="mb-8 space-y-6">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-4 py-2 rounded-full text-sm font-semibold glass-card glow-on-hover hover:scale-105 transition-transform duration-200 cursor-pointer"
                  >
                    <Tag className="h-4 w-4 animate-pulse" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>
                  {typeof blog.authorId === "object" &&
                  blog.authorId &&
                  "name" in blog.authorId
                    ? blog.authorId.name
                    : "Anonymous"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(
                    blog.publishedAt ||
                      blog.createdAt ||
                      new Date().toISOString()
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="lg"
                onClick={handleLike}
                disabled={!isAuthenticated || isLiking}
                className={`flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base ${
                  isLiked
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/25"
                    : "glass-card glow-on-hover hover:bg-red-50 dark:hover:bg-red-950/20"
                } ${isLiking ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLiking ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-current" />
                ) : (
                  <Heart
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isLiked ? "fill-current text-white" : "text-red-500"
                    }`}
                  />
                )}
                <span
                  className={`font-medium ${
                    isLiked ? "text-white" : "text-red-500"
                  }`}
                >
                  {blog.likes.length}
                </span>
                <span
                  className={`hidden sm:inline ${
                    isLiked ? "text-white" : "text-foreground"
                  }`}
                >
                  {isLiking ? "" : isLiked ? "Liked" : "Like"}
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:px-6 sm:py-3 rounded-full glass-card glow-on-hover hover:bg-primary/5 text-sm sm:text-base"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="font-medium hidden sm:inline">Share</span>
              </Button>

              {isOwner && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleEdit}
                    className="flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:px-6 sm:py-3 rounded-full glass-card glow-on-hover hover:bg-blue-50 dark:hover:bg-blue-950/20 text-sm sm:text-base"
                  >
                    <Edit3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span className="font-medium text-blue-600 hidden sm:inline">
                      Edit
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:px-6 sm:py-3 rounded-full glass-card glow-on-hover hover:bg-red-50 dark:hover:bg-red-950/20 text-sm sm:text-base"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                    <span className="font-medium text-red-600 hidden sm:inline">
                      Delete
                    </span>
                  </Button>
                </>
              )}
            </div>
          </header>

          {blog.media && blog.media.length > 0 && (
            <div className="mb-12 glass-card p-6 rounded-2xl glow-on-hover">
              <ImageGallery images={blog.media} />
            </div>
          )}

          <article className="mb-12">
            <div className="glass-card rounded-2xl p-8 glow-on-hover">
              <div
                className="prose prose-lg prose-enhanced max-w-none
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-p:text-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg
                  prose-blockquote:text-muted-foreground prose-blockquote:border-primary prose-blockquote:border-l-4 prose-blockquote:pl-6
                  prose-ul:text-foreground prose-ol:text-foreground
                  prose-li:text-foreground
                  prose-img:rounded-lg prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            </div>
          </article>

          {typeof blog.authorId === "object" &&
            blog.authorId &&
            "name" in blog.authorId && (
              <div className="mb-12 glass-card p-8 rounded-2xl glow-on-hover float-animation">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary via-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/25">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {blog.authorId.name}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-4 font-medium">
                      ✨ Writer & Content Creator
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Passionate about sharing knowledge and insights through
                      engaging content. Follow for more articles on technology,
                      design, and innovation. Creating content that inspires and
                      educates the community.
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        🚀 Innovator
                      </div>
                      <div className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                        📝 Storyteller
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className=" border-red-200 dark:border-red-800">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <span>Delete Blog Post</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-4">
              Are you sure you want to delete &quot;
              <strong>{blog.title}</strong>&quot;? This action cannot be undone
              and will permanently remove the blog post and all its associated
              data.
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

export default BlogDetailsPage;
