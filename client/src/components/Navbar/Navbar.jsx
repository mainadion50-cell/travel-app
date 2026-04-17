// src/components/Navbar/Navbar.jsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Make sure you have lucide-react installed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              TG
            </div>
            <span className="text-white text-2xl font-semibold tracking-tight">
              TravelGroup
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="/login"
              className="text-gray-300 hover:text-white px-5 py-2 rounded-lg transition-colors"
            >
              Login
            </a>
            <a 
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all active:scale-95"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-gray-800">
            <div className="flex flex-col gap-6 text-center">
              <a href="#features" className="text-gray-300 hover:text-white py-2">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white py-2">Pricing</a>
              <a href="#about" className="text-gray-300 hover:text-white py-2">About</a>
              
              <div className="pt-4 flex flex-col gap-4">
                <a 
                  href="/login"
                  className="text-gray-300 hover:text-white py-3 border border-gray-700 rounded-xl"
                >
                  Login
                </a>
                <a 
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium text-white"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;