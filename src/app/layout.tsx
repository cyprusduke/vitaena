import type { Metadata } from "next"
import { Noto_Serif } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import HeaderHeightSync from "@/components/HeaderHeightSync"
import "./globals.css"

const notoSerif = Noto_Serif({
  subsets: ["latin", "greek"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif",
})

export const metadata: Metadata = {
  title: "Vitaena — Греческий язык",
  description: "Интерактивные упражнения для изучения греческого языка",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={notoSerif.variable}>
      <body className="min-h-screen bg-stone-50 text-stone-900 font-sans">
        <HeaderHeightSync />
        <header className="border-b border-stone-200 bg-white relative z-20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Vitaena" height={44} width={82} className="object-contain" />
            </Link>
            <nav className="flex gap-6 text-sm text-stone-500">
              <Link href="/" className="hover:text-stone-800 transition">
                Темы
              </Link>
            </nav>
          </div>
        </header>
        <main className="px-4 py-8">{children}</main>
        <footer className="border-t border-stone-200 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-stone-400">
            Vitaena · Греческий язык · {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  )
}
