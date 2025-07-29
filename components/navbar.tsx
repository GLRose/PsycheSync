import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="border-b-4 border-black py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-black">
              Psyche<span className="text-purple-600">Sync</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button variant="outline" className="md:hidden border-2 border-black rounded-none p-2">
            <Menu className="h-6 w-6" />
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-bold hover:text-purple-600 transition-colors">
              HOME
            </Link>
            <Link href="/how-it-works" className="font-bold hover:text-purple-600 transition-colors">
              HOW IT WORKS
            </Link>
            <Link href="/personality-types" className="font-bold hover:text-purple-600 transition-colors">
              PERSONALITY TYPES
            </Link>
            <Link href="/about" className="font-bold hover:text-purple-600 transition-colors">
              ABOUT
            </Link>
            <Button className="bg-black hover:bg-gray-800 text-white font-bold rounded-none">SIGN UP</Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

