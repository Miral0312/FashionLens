import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href="/" className="font-playfair text-xl">
          Fashion Lens
        </Link>
        <div className="hidden space-x-8 md:flex">
          <Link href="#" className="text-sm">
            ABOUT
          </Link>
          <Link href="#" className="text-sm">
            SERVICES
          </Link>
          <Link href="#" className="text-sm">
            EVENTS
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Sign In</Button>
          <Button>Try Now</Button>
        </div>
      </div>
    </nav>
  )
}

