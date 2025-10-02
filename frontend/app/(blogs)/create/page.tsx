"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import toast from "react-hot-toast";
import {
  createBlog,
  uploadImages,
  clearError,
  BlogMedia,
} from "@/lib/store/features/blogSlice";
import "@/components/rich-text-editor.css";
import {
  ImagePlus,
  X,
  Star,
  Eye,
  Upload,
  Tag,
  Type,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface MediaItem extends BlogMedia {
  id: string;
  isThumbnail?: boolean;
}

const CreateBlogPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { creating, uploadingImages, error } = useAppSelector(
    (state) => state.blog
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    try {
      const result = await dispatch(uploadImages(fileArray)).unwrap();

      const newMedia: MediaItem[] = result.map((item, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        url: item.url,
        alt: item.alt,
        isThumbnail: media.length === 0 && index === 0,
      }));

      setMedia([...media, ...newMedia]);
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast.error("Failed to upload images. Please try again.");
    }
  };

  const handleSetThumbnail = (id: string) => {
    setMedia(
      media.map((item) => ({
        ...item,
        isThumbnail: item.id === id,
      }))
    );
  };

  const handleRemoveImage = (id: string) => {
    const updatedMedia = media.filter((item) => item.id !== id);
    if (
      updatedMedia.length > 0 &&
      !updatedMedia.some((item) => item.isThumbnail)
    ) {
      updatedMedia[0].isThumbnail = true;
    }
    setMedia(updatedMedia);
  };

  const handlePublish = async () => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    try {
      const blogData = {
        title: title.trim(),
        description: description.trim(),
        media: media.map((item) => ({ url: item.url, alt: item.alt })),
        tags,
        isPublished: true,
        likes: [],
      };

      await dispatch(createBlog(blogData)).unwrap();

      toast.success("Blog published successfully!");

      setTitle("");
      setDescription("");
      setTags([]);
      setMedia([]);

      router.push("/");
    } catch (error) {
      console.error("Failed to create blog:", error);
      toast.error((error as string) || "Failed to create blog");
    }
  };

  const handlePreview = () => {
    if (title.trim() && description.trim()) {
      setShowPreview(true);
    }
  };

  const isFormValid =
    title.trim().length >= 3 && description.trim().length >= 10;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-0 pb-8 lg:pb-12 max-w-7xl 2xl:max-w-[110rem]">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/30">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Create Your Story
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Share your thoughts with the world. Create beautiful, engaging
            content.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Title Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Type className="h-5 w-5 text-primary" />
                  <span>Blog Title</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter an engaging title for your blog..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg h-12 border-0 bg-muted/50 focus:bg-muted/80 transition-all duration-300"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {title.length}/200 characters
                </p>
              </CardContent>
            </Card>

            {/* Rich Text Editor Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <div className="p-1 rounded bg-gradient-to-br from-primary/20 to-primary/30">
                    <Type className="h-4 w-4 text-primary" />
                  </div>
                  <span>Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Start writing your story... Use the toolbar above to format your text, add links, images, and more!"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 md:col-span-2   ">
            {/* Action Buttons */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardContent className="p-[30px] space-y-3">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <Button
                  onClick={handlePublish}
                  disabled={!isFormValid || creating}
                  className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Publish Blog
                    </>
                  )}
                </Button>

                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={handlePreview}
                      disabled={!isFormValid}
                      variant="outline"
                      className="w-full h-12 text-base"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Preview Blog
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Blog Preview
                      </DialogTitle>
                      <DialogDescription>
                        Here&apos;s how your blog will appear to readers
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Blog Title */}
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                          {title}
                        </h1>
                      </div>

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Media Gallery */}
                      {media.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Media Gallery
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {media.map((item) => (
                              <div
                                key={item.id}
                                className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                              >
                                <Image
                                  src={item.url}
                                  alt={item.alt}
                                  width={300}
                                  height={300}
                                  className="w-full h-full object-cover"
                                />
                                {item.isThumbnail && (
                                  <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                                    <Star className="h-3 w-3" />
                                    <span>Thumbnail</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Blog Content */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          Content
                        </h3>
                        <div
                          className="prose prose-lg max-w-none bg-muted/30 rounded-lg p-6"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Blog Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Word count:</span>
                    <span className="font-medium">
                      {
                        description
                          .replace(/<[^>]*>/g, "")
                          .split(" ")
                          .filter((word) => word.length > 0).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reading time:</span>
                    <span className="font-medium">
                      ~
                      {Math.ceil(
                        description
                          .replace(/<[^>]*>/g, "")
                          .split(" ")
                          .filter((word) => word.length > 0).length / 200
                      )}{" "}
                      min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Images:</span>
                    <span className="font-medium">{media.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tags:</span>
                    <span className="font-medium">{tags.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tags Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Tag className="h-5 w-5 text-primary" />
                  <span>Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    className="border-0 bg-muted/50 focus:bg-muted/80 transition-all duration-300"
                  />
                  <Button onClick={handleAddTag} size="sm" className="px-4">
                    Add
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-gradient-to-r from-primary/20 to-primary/30 text-primary px-3 py-1 rounded-full text-sm flex items-center space-x-1 group hover:from-primary/30 hover:to-primary/40 transition-all duration-300"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Media Upload Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Media Gallery</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Upload Area */}
                <div className="mb-6">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 group">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 group-hover:scale-110 transition-transform duration-300">
                          {uploadingImages ? (
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                          ) : (
                            <ImagePlus className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            {uploadingImages ? "Uploading..." : "Upload Images"}
                          </p>
                          <p className="text-muted-foreground">
                            Drag & drop or click to select files
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={uploadingImages}
                    onChange={(e) =>
                      e.target.files && handleImageUpload(e.target.files)
                    }
                    className="hidden"
                  />
                </div>

                {/* Media Grid */}
                {media.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {media.map((item) => (
                      <div key={item.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item.url}
                            alt={item.alt}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Thumbnail Badge */}
                        {item.isThumbnail && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>Thumbnail</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center space-x-2">
                          {!item.isThumbnail && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSetThumbnail(item.id)}
                              className="bg-white/90 text-black hover:bg-white"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveImage(item.id)}
                            className="bg-red-500/90 hover:bg-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;
