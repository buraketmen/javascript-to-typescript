import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Js ⇄ Ts",
  description: "Convert JavaScript code to TypeScript and vice versa. A modern, fast, and easy-to-use online converter with type inference.",
  keywords: ["JavaScript", "TypeScript", "converter", "type inference", "code conversion", "js to ts", "ts to js"],
  authors: [{ name: "Hasan Burak Ketmen" }],
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      }
    ]
  },
  openGraph: {
    title: "Js ⇄ Ts",
    description: "Convert JavaScript code to TypeScript and vice versa. A modern, fast, and easy-to-use online converter with type inference.",
    type: "website",
  },
  twitter: {
    title: "Js ⇄ Ts",
    description: "Convert JavaScript code to TypeScript and vice versa. A modern, fast, and easy-to-use online converter with type inference.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
