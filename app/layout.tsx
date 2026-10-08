import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "DREAMFRAME — Interactive Superbike Engineering",
  description:
    "Explore a cinematic superbike experience with exploded engineering, interactive telemetry, a 360° bike configurator, and scroll-reactive engine audio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${spaceGrotesk.variable} dark h-full antialiased`}
    >
      <head>
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
        ></script>
      </head>
      <body className="min-h-full bg-black text-gray-100 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
