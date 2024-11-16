/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/": ["../prompt/**/*", "../content/**/*"],
    },
  },
}

module.exports = nextConfig
