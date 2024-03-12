/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites() {
    return {
      fallback: [
      {
        source: '/:path*',
        destination: 'http://localhost:3000/:path*',
      }],
    };
  }
};

export default nextConfig;
