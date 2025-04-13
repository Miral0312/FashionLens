import { Link } from "react-router-dom"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h4 className="font-playfair text-xl">Fashion Lens</h4>
            <p className="mt-4 text-sm text-gray-400">AI-powered fashion trends and analytics platform</p>
          </div>
          <div>
            <h5 className="font-semibold">Quick Links</h5>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Services</h5>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/services/trend-analysis">Trend Analysis</Link>
              </li>
              <li>
                <Link to="/services/color-prediction">Color Prediction</Link>
              </li>
              <li>
                <Link to="/services/design-direction">Design Direction</Link>
              </li>
              <li>
                <Link to="/services/sustainability-index">Sustainability Index</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Connect</h5>
            <div className="mt-4 flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Fashion Lens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

