import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Hybrid E-Voting System",
    description: "Secure and transparent elections using blockchain technology",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-gray-50">
                {children}
            </body>
        </html>
    );
}
