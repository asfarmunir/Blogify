"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, PlusCircle, BookOpen, Settings } from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[110rem]">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <BookOpen className="h-7 w-7 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Blogify
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/blogs"
                className="text-base lg:text-lg font-medium transition-colors hover:text-primary text-foreground"
              >
                Blogs
              </Link>
              {isAuthenticated && (
                <Link
                  href="/blogs/create"
                  className="text-base lg:text-lg font-medium transition-colors hover:text-primary text-muted-foreground"
                >
                  Write
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Button
                  variant="ghost"
                  size="default"
                  className="hidden md:flex"
                  asChild
                >
                  <Link href="/blogs/create">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span className="text-base font-medium">Write</span>
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 lg:h-12 lg:w-12 rounded-full"
                    >
                      <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 border-2 border-primary/20">
                        <User className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-2">
                        <p className="text-base font-semibold leading-none">
                          {user?.name}
                        </p>
                        <p className="text-sm leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="py-3">
                        <Link href="/profile">
                          <User className="mr-3 h-5 w-5" />
                          <span className="text-base">Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="py-3">
                        <Link href="/my-blogs">
                          <BookOpen className="mr-3 h-5 w-5" />
                          <span className="text-base">My Blogs</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="py-3">
                        <Link href="/settings">
                          <Settings className="mr-3 h-5 w-5" />
                          <span className="text-base">Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="py-3">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span className="text-base">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleLogin}
                  className="text-base font-medium px-6"
                >
                  Log in
                </Button>
                <Button
                  size="default"
                  onClick={handleRegister}
                  className="text-base font-medium px-6"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
