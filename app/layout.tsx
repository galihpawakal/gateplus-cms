import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gateplus CMS - Content Management',
  description: 'Platform manajemen konten sederhana dan modern',
  keywords: ['CMS', 'Content Management', 'Articles', 'Blog'],
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}