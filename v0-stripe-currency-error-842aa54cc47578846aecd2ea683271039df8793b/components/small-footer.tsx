"use client"

import Link from "next/link"

export function SmallFooter() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm text-gray-600">© 2025 Be Inc. Всички права запазени.</p>
        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          <Link href="/track-order" className="text-sm text-gray-600 hover:text-gray-900">
            Проследи поръчка
          </Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
            Условия за ползване
          </Link>
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
            Поверителност
          </Link>
        </div>
      </div>
    </footer>
  )
}
