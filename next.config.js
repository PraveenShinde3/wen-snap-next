/** @type {import('next').NextConfig} */
const nextConfig = { externals: ["aws-sdk", "chrome-aws-lambda"] };

module.exports = nextConfig;
