import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Navbar from "@/components/Navbar"

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900"
})
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900"
})

export const metadata: Metadata = {
    title: "Semaphore Explorer",
    description: "Discover Semaphore groups, view members and zero-knowledge proofs.",
    icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
    metadataBase: new URL("https://explorer.semaphore.pse.dev"),
    openGraph: {
        type: "website",
        url: "https://explorer.semaphore.pse.dev",
        title: "Semaphore Explorer",
        description: "Discover Semaphore groups, view members and zero-knowledge proofs.",
        siteName: "Semaphore Explorer",
        images: [
            {
                url: "https://explorer.semaphore.pse.dev/social-media.png"
            }
        ]
    },
    twitter: { card: "summary_large_image", images: "https://explorer.semaphore.pse.dev/social-media.png" }
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Navbar />
                {children}
            </body>
        </html>
    )
}
