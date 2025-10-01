"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchBlogById,
  updateBlog,
  uploadImages,
} from "@/lib/store/features/blogSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Image as ImageIcon,
  Tag as TagIcon,
  FileText,
  Eye,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/RichTextEditor";

interface BlogFormData {
  title: string;
  description: string;
  media: Array<{ url: string; alt: string }>;
  tags: string[];
  isPublished: boolean;
}

const EditBlogPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { currentBlog, loading, updating, uploadingImages } = useAppSelector(
    (state) => state.blog
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const blogId = params.id as string;

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    description: "",
    media: [],
    tags: [],
    isPublished: true,
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
    }
  }, [dispatch, blogId]);

  useEffect(() => {
    if (currentBlog) {
      const userId = user
        ? (user as { _id?: string; id?: string })._id ||
          (user as { _id?: string; id?: string }).id ||
          ""
        : "";

      const isOwner =
        (typeof currentBlog.authorId === "object" &&
          currentBlog.authorId &&
          "_id" in currentBlog.authorId &&
          currentBlog.authorId._id === userId) ||
        (typeof currentBlog.authorId === "string" &&
          currentBlog.authorId === userId);

      if (!isOwner) {
        router.push(`/${blogId}`);
        return;
      }

      setFormData({
        title: currentBlog.title,
        description: currentBlog.description,
        media: currentBlog.media || [],
        tags: currentBlog.tags || [],
        isPublished: currentBlog.isPublished,
      });
    }
  }, [currentBlog, user, blogId, router]);

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length > 0) {
      const result = await dispatch(uploadImages(validFiles));
      if (uploadImages.fulfilled.match(result)) {
        setFormData((prev) => ({
          ...prev,
          media: [...prev.media, ...result.payload],
        }));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (
      tagInput.trim() &&
      !formData.tags.includes(tagInput.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    const result = await dispatch(
      updateBlog({
        id: blogId,
        updates: {
          title: formData.title.trim(),
          description: formData.description,
          media: formData.media,
          tags: formData.tags,
          isPublished: formData.isPublished,
        },
      })
    );

    if (updateBlog.fulfilled.match(result)) {
      router.push(`/${blogId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 animated-bg flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg font-medium">Loading blog...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to edit blogs.</p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 animated-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href={`/${blogId}`}>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Edit Blog Post
            </h1>
            <p className="text-muted-foreground text-lg">
              Update your content and share your thoughts with the world
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card p-6 glow-on-hover">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <FileText className="h-5 w-5" />
                    <Label className="text-lg font-semibold">Title</Label>
                  </div>
                  <Input
                    placeholder="Enter your blog title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="text-lg h-12"
                  />
                </div>
              </Card>

              <Card className="glass-card p-6 glow-on-hover">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <FileText className="h-5 w-5" />
                    <Label className="text-lg font-semibold">Content</Label>
                  </div>
                  <RichTextEditor
                    content={formData.description}
                    onChange={(content) =>
                      handleInputChange("description", content)
                    }
                  />
                </div>
              </Card>

              <Card className="glass-card p-6 glow-on-hover">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <ImageIcon className="h-5 w-5" />
                    <Label className="text-lg font-semibold">Images</Label>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Drag and drop images here, or click to select
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      disabled={uploadingImages}
                    >
                      {uploadingImages ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </>
                      )}
                    </Button>
                  </div>

                  {formData.media.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {formData.media.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-card p-6 glow-on-hover">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <TagIcon className="h-5 w-5" />
                    <Label className="text-lg font-semibold">Tags</Label>
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="flex-1"
                    />
                    <Button onClick={addTag} variant="outline" size="icon">
                      <TagIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Button
                  onClick={() => setPreviewOpen(true)}
                  variant="outline"
                  className="w-full glass-card glow-on-hover"
                  disabled={
                    !formData.title.trim() || !formData.description.trim()
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  disabled={
                    updating ||
                    !formData.title.trim() ||
                    !formData.description.trim()
                  }
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Blog
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Preview</span>
            </DialogTitle>
            <DialogDescription>
              This is how your blog post will appear to readers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="space-y-4">
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <TagIcon className="h-3 w-3" />
                      <span>#{tag}</span>
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl font-bold text-foreground">
                {formData.title || "Untitled Blog Post"}
              </h1>
            </div>

            {formData.media.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.media.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              className="prose prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-p:text-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg
                prose-blockquote:text-muted-foreground prose-blockquote:border-primary prose-blockquote:border-l-4 prose-blockquote:pl-6"
              dangerouslySetInnerHTML={{
                __html: formData.description || "<p>No content yet...</p>",
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBlogPage;
