/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/": ["../prompt/**/*", "../content/**/*"],
  },
}

module.exports = nextConfig
