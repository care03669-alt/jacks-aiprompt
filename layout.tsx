import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jaccksallas AI — Master Prompt Builder",
  description: "Build powerful, structured AI prompts for games, apps, and websites.",
  applicationName: "Jaccksallas AI"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
