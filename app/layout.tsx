import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { TanstackQueryProvider } from "@/components/providers/tanstackQueryProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const siteTitle = "Hocein — Full-Stack Web Developer"
const siteDescription =
  "Hocein builds thoughtful web applications and configures production-ready infrastructure from scratch."

export const metadata: Metadata = {
  metadataBase: new URL("https://hoce1n.ir"),
  title: siteTitle,
  description: siteDescription,
  authors: [{ name: "Hocein", url: "./" }],
  creator: "Hocein",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "./",
    siteName: "Hocein",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} bg-background text-foreground antialiased`}
      >
        <TanstackQueryProvider>
          <ThemeProvider>
            {children}
            <Toaster position="bottom-right" theme="dark" />
          </ThemeProvider>
        </TanstackQueryProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
