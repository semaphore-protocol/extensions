/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/sepolia",
                permanent: true
            }
        ]
    },
    reactStrictMode: false
}

export default nextConfig
