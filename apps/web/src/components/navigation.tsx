import Link from 'next/link';
import { WalletButton } from './wallet-button';

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-blue-950 via-slate-900 to-transparent border-b border-blue-900 border-opacity-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <div className="text-3xl">🎓</div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-cyan-400 transition">
              CertNFT
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-cyan-400 font-medium transition relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/issue" 
              className="text-gray-300 hover:text-blue-400 font-medium transition relative group"
            >
              <span className="mr-2">✏️</span>Issue
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/verify" 
              className="text-gray-300 hover:text-green-400 font-medium transition relative group"
            >
              <span className="mr-2">✓</span>Verify
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center">
            <WalletButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-3 mt-4 flex-wrap pb-2">
          <Link 
            href="/" 
            className="text-xs text-gray-300 hover:text-cyan-400 font-medium transition px-3 py-1 rounded-full hover:bg-blue-900 hover:bg-opacity-30"
          >
            Home
          </Link>
          <Link 
            href="/issue" 
            className="text-xs text-blue-300 font-semibold transition px-3 py-1 rounded-full bg-blue-900 bg-opacity-30 hover:bg-opacity-50"
          >
            ✏️ Issue
          </Link>
          <Link 
            href="/verify" 
            className="text-xs text-green-300 font-semibold transition px-3 py-1 rounded-full bg-green-900 bg-opacity-30 hover:bg-opacity-50"
          >
            ✓ Verify
          </Link>
        </div>
      </div>
    </nav>
  );
}
