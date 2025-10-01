"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import "./rich-text-editor.css";

// Custom FontSize extension
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace("px", ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <Button
    type="button"
    variant={isActive ? "default" : "ghost"}
    size="sm"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`h-8 w-8 p-0 ${
      isActive
        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
        : "hover:bg-muted/80"
    } transition-all duration-200`}
  >
    {children}
  </Button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing your story...",
}) => {
  const [currentFontSize, setCurrentFontSize] = React.useState("default");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: {
          HTMLAttributes: {
            class: "font-bold",
          },
        },
        italic: {
          HTMLAttributes: {
            class: "italic",
          },
        },
        strike: {
          HTMLAttributes: {
            class: "line-through",
          },
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary hover:text-primary/80 underline transition-colors",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      FontSize,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      // Update current font size when selection changes
      const attrs = editor.getAttributes("textStyle");
      if (attrs.fontSize) {
        const size = attrs.fontSize.toString();
        const sizeWithPx = size.includes("px") ? size : `${size}px`;
        setCurrentFontSize(sizeWithPx);
      } else {
        setCurrentFontSize("default");
      }
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[400px] lg:min-h-[500px] p-6",
        spellcheck: "false",
      },
    },
  });

  // Initialize font size state when editor is ready
  React.useEffect(() => {
    if (editor) {
      const attrs = editor.getAttributes("textStyle");
      if (attrs.fontSize) {
        const size = attrs.fontSize.toString();
        const sizeWithPx = size.includes("px") ? size : `${size}px`;
        setCurrentFontSize(sizeWithPx);
      } else {
        setCurrentFontSize("default");
      }
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const setFontSize = (size: string) => {
    if (!editor) return;

    if (size === "default") {
      editor.chain().focus().unsetFontSize().run();
      setCurrentFontSize("default");
    } else {
      const sizeValue = size.replace("px", "");
      editor.chain().focus().setFontSize(sizeValue).run();
      setCurrentFontSize(size);
    }
  };

  const getCurrentFontSize = () => {
    return currentFontSize;
  };

  return (
    <div
      className="border-0 rounded-lg bg-gradient-to-br from-muted/30 to-muted/20 focus-within:from-muted/50 focus-within:to-muted/30 transition-all duration-300 overflow-hidden"
      style={{ userSelect: "text" }}
    >
      {/* Toolbar */}
      <div className="border-b bg-gradient-to-r from-muted/50 to-muted/30 p-3">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 mr-3">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Font Size */}
          <div className="flex gap-1 mr-3">
            <Select value={getCurrentFontSize()} onValueChange={setFontSize}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="12px">12px</SelectItem>
                <SelectItem value="14px">14px</SelectItem>
                <SelectItem value="16px">16px</SelectItem>
                <SelectItem value="18px">18px</SelectItem>
                <SelectItem value="20px">20px</SelectItem>
                <SelectItem value="24px">24px</SelectItem>
                <SelectItem value="28px">28px</SelectItem>
                <SelectItem value="32px">32px</SelectItem>
                <SelectItem value="36px">36px</SelectItem>
                <SelectItem value="48px">48px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lists and Quotes */}
          <div className="flex gap-1 mr-3">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 mr-3">
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Insert */}
          <div className="flex gap-1 mr-3">
            <MenuButton
              onClick={editor.isActive("link") ? removeLink : addLink}
              isActive={editor.isActive("link")}
              title={editor.isActive("link") ? "Remove Link" : "Add Link"}
            >
              <Link2 className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </MenuButton>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-transparent min-h-[400px] lg:min-h-[550px]">
        <EditorContent editor={editor} className="rich-text-editor" />
      </div>
    </div>
  );
};
