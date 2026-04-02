import Link from 'next/link';
import { WalletButton } from '@/components/wallet-button';

export default function Home() {
  return (
    <main className="min-h-screen pt-20 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-blue-600 via-purple-600 to-transparent opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-cyan-600 via-blue-600 to-transparent opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 py-16 max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-blue-900 bg-opacity-30 border border-blue-700 border-opacity-50 backdrop-blur-sm">
            <span className="text-blue-400 text-sm font-semibold">✨ Powered by Blockchain</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6 leading-tight">
            <span className="block mb-3">Blockchain</span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Certificates
            </span>
            <span className="block text-white">Verified Forever</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-12 leading-relaxed">
            Issue tamper-proof NFT certificates. Students own their credentials forever.
            <br />
            <span className="text-cyan-400 font-semibold">Employers verify instantly.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-6 mb-16 w-full md:w-auto">
            <Link
              href="/issue"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl overflow-hidden transform transition hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>✏️ Issue Certificate</span>
              </span>
            </Link>
            <Link
              href="/verify"
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl overflow-hidden transform transition hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>✓ Verify Certificate</span>
              </span>
            </Link>
          </div>

          {/* Wallet Connection Section */}
          <div className="w-full md:w-auto mb-16 flex justify-center">
            <div className="bg-blue-950 bg-opacity-30 backdrop-blur-xl rounded-xl border border-blue-700 border-opacity-50 p-8 md:p-12">
              <p className="text-gray-300 text-center mb-6 font-medium">
                Get started by connecting your wallet
              </p>
              <WalletButton />
            </div>
          </div>

          {/* Features Grid */}
          <div className="w-full mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose CertNFT?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition duration-300"></div>
                <div className="relative bg-blue-950 bg-opacity-30 backdrop-blur-md rounded-2xl p-8 border border-blue-700 border-opacity-30 group-hover:border-opacity-100 transition">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-bold text-blue-300 mb-3">Tamper-Proof</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Blockchain immutability ensures certificates cannot be altered or counterfeited. Hash-based verification proves authenticity.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition duration-300"></div>
                <div className="relative bg-cyan-950 bg-opacity-30 backdrop-blur-md rounded-2xl p-8 border border-cyan-700 border-opacity-30 group-hover:border-opacity-100 transition">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-cyan-300 mb-3">Instant Verification</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Employers verify credentials instantly without contacting institutions. Real-time verification on the blockchain.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition duration-300"></div>
                <div className="relative bg-purple-950 bg-opacity-30 backdrop-blur-md rounded-2xl p-8 border border-purple-700 border-opacity-30 group-hover:border-opacity-100 transition">
                  <div className="text-4xl mb-4">👤</div>
                  <h3 className="text-xl font-bold text-purple-300 mb-3">Student Owned</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Recipients own their credentials directly in their blockchain wallet. Permanent ownership, zero intermediaries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="w-full bg-gradient-to-r from-blue-950 via-slate-900 to-purple-950 bg-opacity-50 backdrop-blur-xl rounded-2xl p-10 md:p-16 border border-blue-700 border-opacity-30">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-blue-300 mb-3">Issue Certificate</h3>
                <p className="text-gray-400">
                  Navigate to Issue page and mint certificates to student wallets as unique NFTs with course, grade, and date data.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-cyan-400 text-3xl">→</div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Student Received NFT</h3>
                <p className="text-gray-400">
                  The NFT certificate transfers directly to the student's wallet, which they permanently own and control.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-purple-400 text-3xl">→</div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold text-white mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">Verify Anytime</h3>
                <p className="text-gray-400">
                  Go to Verify page and check any certificate. Instant, public, and requires no intermediaries or trust.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}