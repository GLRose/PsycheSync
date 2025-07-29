import type React from "react";
import "./globals.css";
import {Inter} from "next/font/google";
import {ThemeProvider} from "@/components/theme-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "PsycheSync - AI-Driven Personality Hub",
    description: "Discover your true personality type through AI analysis of your conversations.",
    generator: "v0.dev",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

import "./globals.css";
