/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    //remove these lines if you want to use eslint
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // remotePatterns: [
  //   {
  //     protocol: "https",
  //     hostname: "res.cloudinary.com",
  //     port: "",
  //     pathname: "/unionwealthmanagement/**",
  //   },
  // ],
  images: {
    domains : ["res.cloudinary.com", "images.unsplash.com"],
  },
};

export default nextConfig;