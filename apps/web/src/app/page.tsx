import Link from 'next/link';
import { WalletButton } from '@/components/wallet-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎓 Blockchain Certificate Verification
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Issue and verify academic certificates as immutable NFTs on the blockchain. 
            <br />
            Tamper-proof, instantly verifiable, permanently owned by the recipient.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Tamper-Proof</h3>
              <p className="text-gray-400 text-sm">Blockchain immutability ensures certificates cannot be altered or counterfeited</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-green-300 mb-2">Instant Verification</h3>
              <p className="text-gray-400 text-sm">Employers verify credentials instantly without contacting institutions</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Student Owned</h3>
              <p className="text-gray-400 text-sm">Recipients own their credentials directly in their blockchain wallet</p>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
            <Link
              href="/issue"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition transform hover:scale-105 text-lg"
            >
              ✏️ Issue Certificate
            </Link>
            <Link
              href="/verify"
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition transform hover:scale-105 text-lg"
            >
              ✓ Verify Certificate
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <p className="text-gray-300 mb-4">Ready to get started? Connect your wallet.</p>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 text-left bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">How It Works</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">1. Institution Issues Certificate</h3>
                <p>Navigate to the Issue page and mint certificates to student wallets as unique NFTs with embedded metadata (course, grade, issuance date)</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">2. Student Receives NFT</h3>
                <p>The NFT certificate is transferred directly to the student's blockchain wallet, which they now permanently own and control</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">3. Anyone Can Verify</h3>
                <p>Go to the Verify page and check any certificate using its token ID. Verification is instant, public, and requires no intermediaries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}