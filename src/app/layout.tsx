import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Signature',
  description: 'My personal collection of all my professional life',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
