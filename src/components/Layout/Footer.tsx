import type React from "react"
import { Link } from "react-router-dom"
import { Instagram, MessageCircle, Linkedin, Mail, Phone } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <img src="/new_bla-white.png" alt="SRD Consulting" className="h-12 w-auto mb-4" />
            <p className="text-gray mb-6 max-w-md">
              SRD Consulting Ltd provides tailored communications and public relations solutions, helping organizations
              tell their stories effectively and build meaningful connections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray hover:text-primary transition-colors">
                <MessageCircle size={24} />
              </a>
              <a href="#" className="text-gray hover:text-primary transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="text-gray hover:text-primary transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray hover:text-primary transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-gray">info@srdconsultingltd.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-gray">+234 705 841 2630</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <span className="text-gray">© {new Date().getFullYear()} SRD Consulting Ltd. All rights reserved.</span>
              <span className="text-gray">
                Developed by{" "}
                <a href="www.nexatrux.com" className="hover:text-primary transition-colors">
                  Nexa Trux
                </a>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/terms-and-conditions" className="text-gray hover:text-primary transition-colors text-sm">
                Terms & Conditions
              </Link>
              <Link to="/privacy-policy" className="text-gray hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
