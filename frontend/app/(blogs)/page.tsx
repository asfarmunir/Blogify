"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
const Blogs = () => {
  const { logout } = useAuth();
  return (
    <div>
      Blogs
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={logout}
      >
        logout
      </button>
    </div>
  );
};

export default Blogs;
