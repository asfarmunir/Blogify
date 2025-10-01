"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/RichTextEditor";
import "@/components/rich-text-editor.css";
import {
  ImagePlus,
  X,
  Star,
  Save,
  Eye,
  Upload,
  Tag,
  Type,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  alt: string;
  isThumbnail?: boolean;
}

const CreateBlogPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
    setIsUploading(true);
    // TODO: Implement Cloudinary upload
    // For now, create mock URLs
    const newMedia: MediaItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mockUrl = URL.createObjectURL(file);
      newMedia.push({
        id: `temp-${Date.now()}-${i}`,
        url: mockUrl,
        alt: file.name,
        isThumbnail: media.length === 0 && i === 0,
      });
    }
    setMedia([...media, ...newMedia]);
    setIsUploading(false);
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

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Saving draft...");
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log("Publishing blog...");
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Opening preview...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-0 py-8 lg:py-12 max-w-7xl 2xl:max-w-[110rem]">
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

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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
                <div className="p-4 border-t bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    ✨ Rich text formatting • 🔗 Links • 📷 Images • 📝 Lists •
                    💻 Code blocks
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <ImageIcon className="h-5 w-5 text-primary" />
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
                          {isUploading ? (
                            <Upload className="h-8 w-8 text-primary animate-pulse" />
                          ) : (
                            <ImagePlus className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            {isUploading ? "Uploading..." : "Upload Images"}
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

          {/* Sidebar */}
          <div className="space-y-8">
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

            {/* Action Buttons */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardContent className="pt-6 space-y-3">
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSaveDraft}
                  variant="secondary"
                  className="w-full h-12 text-base"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handlePublish}
                  className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Publish Blog
                </Button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;
