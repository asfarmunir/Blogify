const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"]
  },
  media: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ""
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, "Tag cannot exceed 30 characters"]
  }],
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"]
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

blogSchema.index({ authorId: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ title: "text", description: "text" });

blogSchema.pre("save", function(next) {
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.methods.publish = function() {
  this.isPublished = true;
  this.publishedAt = new Date();
  return this.save();
};

blogSchema.methods.unpublish = function() {
  this.isPublished = false;
  this.publishedAt = undefined;
  return this.save();
};

blogSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

blogSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => !id.equals(userId));
  return this.save();
};

blogSchema.statics.findPublished = function() {
  return this.find({ isPublished: true }).sort({ publishedAt: -1 });
};

blogSchema.statics.findByAuthor = function(authorId) {
  return this.find({ authorId }).sort({ createdAt: -1 });
};

blogSchema.statics.findByTag = function(tag) {
  return this.find({ tags: tag, isPublished: true }).sort({ publishedAt: -1 });
};

blogSchema.statics.search = function(searchTerm) {
  return this.find(
    { 
      $text: { $search: searchTerm },
      isPublished: true 
    },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
};

module.exports = mongoose.model("Blog", blogSchema);