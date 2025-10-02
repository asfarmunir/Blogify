"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="lg:flex-1 bg-gradient-to-br from-primary via-primary/90 to-[#3AC49D] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-cyber-grid opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 text-white">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Blogging
              <span className="block text-secondary">Reimagined</span>
            </h1>

            <p className="text-lg opacity-90 leading-relaxed">
              Share your thoughts with the world through Blogify&apos;s
              intuitive writing platform. Create, publish, and engage with
              beautiful blog posts that captivate your audience.
            </p>

            <div className="flex items-center justify-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">5k+</div>
                <div className="text-sm opacity-75">Blog Posts</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold">1k+</div>
                <div className="text-sm opacity-75">Active Writers</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold">50k+</div>
                <div className="text-sm opacity-75">Monthly Readers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="lg:flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
