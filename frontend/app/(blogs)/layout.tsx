"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";

interface BlogsLayoutProps {
  children: React.ReactNode;
}

const BlogsLayout = ({ children }: BlogsLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl 2xl:max-w-[110rem]">
          {children}
        </div>
      </main>
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[110rem]">
          <div className="flex flex-col items-center justify-between gap-6 py-12 lg:h-20 lg:flex-row lg:py-0">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
              <p className="text-center text-sm 2xl:text-base leading-relaxed text-muted-foreground lg:text-left">
                Built with ❤️ by Blogify. Share your stories with the world.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm 2xl:text-base text-muted-foreground">
              <span>© 2024 Blogify</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogsLayout;
