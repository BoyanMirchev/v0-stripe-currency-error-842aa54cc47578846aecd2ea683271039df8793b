import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react"

export function AuthFooter() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-6 py-8">
        {/* Payment Methods */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
          <Image src="/images/visa-inc.png" alt="Visa" width={80} height={40} className="h-10 w-auto object-contain" />
          <Image
            src="/images/mastercard-logo.png"
            alt="Mastercard"
            width={80}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <Image
            src="/images/maestro-logo.png"
            alt="Maestro"
            width={80}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <Image src="/images/epay.svg" alt="ePay.bg" width={100} height={40} className="h-10 w-auto object-contain" />
          <div className="border border-gray-300 rounded-lg px-4 py-2">
            <Image
              src="/images/google-pay.png"
              alt="Google Pay"
              width={80}
              height={30}
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="border border-gray-300 rounded-lg px-4 py-2">
            <Image
              src="/images/apple-pay-mark.png"
              alt="Apple Pay"
              width={80}
              height={30}
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Facebook className="h-8 w-8" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 transition-colors"
          >
            <Instagram className="h-8 w-8" />
          </Link>
          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            <Youtube className="h-8 w-8" />
          </Link>
          <Link
            href="https://viber.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 transition-colors"
          >
            <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
              <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.253 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.16 0 0-.395-.025-1.037.002zm.052 1.8c.55-.023.915 0 .915 0 4.8-.13 6.794 1.376 7.255 1.8 1.66 1.5 2.558 4.684 1.888 10.043-.6 4.8-4.094 5.188-4.75 5.402-.283.09-2.925.768-6.314.512 0 0-2.52 3.063-3.302 3.844-.123.123-.27.17-.38.15-.16-.03-.204-.232-.2-.498l.018-4.78c-4.85-1.31-4.56-6.347-4.507-8.953.054-2.604.567-4.65 1.955-6.078C6.32 1.56 9.927 1.27 11.452 1.8z" />
            </svg>
          </Link>
          <Link
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:text-gray-700 transition-colors"
          >
            <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
              <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-800 transition-colors"
          >
            <Linkedin className="h-8 w-8" />
          </Link>
        </div>

        {/* Copyright and Legal */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-700">© Кеш. Всички права запазени. Уеб дизайн StudioX</p>
          <p className="text-xs text-gray-600">
            This site is protected by reCAPTCHA and the Google{" "}
            <Link href="/privacy-policy" className="underline hover:text-gray-800">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms-of-service" className="underline hover:text-gray-800">
              Terms of Service
            </Link>{" "}
            apply.
          </p>
        </div>
      </div>
    </footer>
  )
}
