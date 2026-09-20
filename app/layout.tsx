import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: "Command Kit — Engineering commands worth remembering",
    description:
      "A searchable, high-signal library of practical terminal commands and troubleshooting workflows for engineers.",
    openGraph: {
      title: "Command Kit — Find the command. Keep moving.",
      description: "Engineering commands worth remembering.",
      images: [{ url: socialImage, width: 1536, height: 910, alt: "Command Kit" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Command Kit — Find the command. Keep moving.",
      description: "Engineering commands worth remembering.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
