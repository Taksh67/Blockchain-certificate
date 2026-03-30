import Link from 'next/link';
import { WalletButton } from './wallet-button';

export function Navigation() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Home */}
          <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300">
            🎓 Certificate NFT
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition"
            >
              Home
            </Link>
            <Link 
              href="/issue" 
              className="text-gray-300 hover:text-white transition"
            >
              📝 Issue Certificate
            </Link>
            <Link 
              href="/verify" 
              className="text-gray-300 hover:text-white transition"
            >
              ✓ Verify Certificate
            </Link>
          </div>

          {/* Wallet Button */}
          <WalletButton />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-4 mt-4 flex-wrap">
          <Link 
            href="/" 
            className="text-sm text-gray-300 hover:text-white transition"
          >
            Home
          </Link>
          <Link 
            href="/issue" 
            className="text-sm text-blue-400 hover:text-blue-300 transition font-semibold"
          >
            📝 Issue
          </Link>
          <Link 
            href="/verify" 
            className="text-sm text-green-400 hover:text-green-300 transition font-semibold"
          >
            ✓ Verify
          </Link>
        </div>
      </div>
    </nav>
  );
}
