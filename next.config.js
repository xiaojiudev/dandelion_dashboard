/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['i.ebayimg.com', 'images.pexels.com','randomuser.me', 'pixahive.com', 'res.cloudinary.com'],
    },
    env: {
        baseURI: process.env.BACKEND_URI
    }
}

module.exports = nextConfig
