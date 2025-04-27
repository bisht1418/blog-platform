import { Link } from "react-router-dom"
import { Facebook, Instagram, Youtube } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src="/placeholder.svg?height=32&width=32" alt="Panini8 Blog" />
              <span className="ml-2 text-xl font-bold text-green-600">Panini8 Blog</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Solve beautiful problems adaptively. Ask doubts and engage with a community of mathematical scientists.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Live Classes</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-base text-gray-600 hover:text-green-600">
                  Olympiad
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-gray-600 hover:text-green-600">
                  Research
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-gray-600 hover:text-green-600">
                  Leadership
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Try</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/blogs" className="text-base text-gray-600 hover:text-green-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-gray-600 hover:text-green-600">
                  Ask a Doubt
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-gray-600 hover:text-green-600">
                  Mock Tests
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-base text-gray-600 hover:text-green-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-gray-600 hover:text-green-600">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-gray-600 hover:text-green-600">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col items-center">
          <p className="text-sm text-gray-500">© 2025 Panini8. All rights reserved.</p>
          <p className="text-sm text-gray-500 mt-2">Designed with ❤️ by the Panini8 Team | We think therefore we are.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
