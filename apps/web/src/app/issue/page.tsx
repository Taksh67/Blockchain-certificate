"use client";
import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { CERTIFICATE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

export default function IssueCertificate() {
  const { isConnected, address } = useAccount();
  const { writeContract, isPending, isSuccess, data: hash } = useWriteContract();
  const [issuedTokenId, setIssuedTokenId] = useState<string | null>(null);

  const [form, setForm] = useState({
    recipient: "",
    studentName: "",
    courseName: "",
    grade: "",
    institution: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      account: address,
      address: CONTRACT_ADDRESS,
      abi: CERTIFICATE_ABI,
      functionName: "issueCertificate",
      args: [
        form.recipient as `0x${string}`,
        form.studentName,
        form.courseName,
        form.grade,
        form.institution,
      ],
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-blue-600 via-purple-600 to-transparent opacity-10 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-blue-950 bg-opacity-50 backdrop-blur-xl rounded-2xl border border-blue-700 border-opacity-50 p-12 text-center">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold mb-4 text-white">Wallet Required</h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Please connect your wallet to issue certificates. Only authorized administrators can issue new certificates.
            </p>
            <p className="text-gray-400 text-sm">
              Use the wallet button in the navigation to connect your Web3 wallet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-blue-600 via-purple-600 to-transparent opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-900 bg-opacity-30 border border-blue-700 border-opacity-50">
            <span className="text-blue-400 text-sm font-semibold">📝 Issue Mode</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Issue Certificate
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Mint a new NFT certificate to a student's wallet
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-blue-950 bg-opacity-40 backdrop-blur-xl rounded-2xl border border-blue-700 border-opacity-30 p-10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { 
                label: "Student Wallet Address", 
                key: "recipient", 
                placeholder: "0x...",
                icon: "👤",
                description: "The recipient's blockchain wallet address"
              },
              { 
                label: "Student Name", 
                key: "studentName", 
                placeholder: "e.g. Sarah Johnson",
                icon: "✍️",
                description: "Full name of the certificate holder"
              },
              { 
                label: "Course Name", 
                key: "courseName", 
                placeholder: "e.g. Advanced Blockchain Development",
                icon: "📚",
                description: "Name of the completed course"
              },
              { 
                label: "Grade", 
                key: "grade", 
                placeholder: "e.g. A+",
                icon: "⭐",
                description: "Final grade received"
              },
              { 
                label: "Institution", 
                key: "institution", 
                placeholder: "e.g. Stanford University",
                icon: "🏫",
                description: "Issuing institution name"
              },
            ].map(({ label, key, placeholder, icon, description }) => (
              <div key={key}>
                <label className="flex items-center gap-2 font-semibold text-gray-200 mb-3">
                  <span className="text-xl">{icon}</span>
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-slate-800 bg-opacity-50 border border-blue-600 border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 transition"
                  required
                />
                <p className="text-gray-400 text-xs mt-2">{description}</p>
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-70 text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  Issue Certificate as NFT
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="bg-gradient-to-r from-green-900 to-emerald-900 border border-green-600 border-opacity-50 rounded-xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div className="flex-1">
                <h3 className="font-bold text-green-300 text-lg mb-2">
                  Certificate Successfully Issued!
                </h3>
                <p className="text-green-200 mb-3">
                  Your certificate NFT has been minted and is being processed on the blockchain.
                </p>
                <div className="bg-black bg-opacity-30 rounded-lg p-4 font-mono text-xs text-green-400 overflow-auto break-all">
                  Tx: {hash?.substring(0, 40)}...
                </div>
                <p className="text-green-200 text-sm mt-3">
                  The certificate will be assigned a random 8-digit Token ID once confirmed on the blockchain.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-purple-950 bg-opacity-40 backdrop-blur-xl rounded-xl border border-purple-700 border-opacity-30 p-8">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">📋 What Happens Next?</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">1.</span>
              <span>The certificate is minted as a unique NFT in the student's wallet</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">2.</span>
              <span>A random 8-digit token ID is assigned (e.g., #57284619)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">3.</span>
              <span>Certificate data is securely stored using hash verification</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">4.</span>
              <span>Anyone can verify the certificate using the token ID</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
