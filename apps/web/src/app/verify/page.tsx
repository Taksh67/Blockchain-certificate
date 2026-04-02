"use client";
import { useState } from "react";
import { useReadContract, useAccount } from "wagmi";
import { CERTIFICATE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

export default function VerifyCertificate() {
  const [tokenId, setTokenId] = useState("");
  const [search, setSearch] = useState<bigint | null>(null);
  const [verificationInputs, setVerificationInputs] = useState({
    recipient: "",
    studentName: "",
    courseName: "",
    grade: "",
    institution: "",
  });

  const { address } = useAccount();

  // Get certificate metadata
  const { data: certificateData, isLoading } = useReadContract({
    account: address,
    address: CONTRACT_ADDRESS,
    abi: CERTIFICATE_ABI,
    functionName: "verifyCertificate",
    args: search !== null ? [search] : undefined,
    query: { enabled: search !== null },
  });

  // Verify certificate data
  const { data: isDataValid } = useReadContract({
    account: address,
    address: CONTRACT_ADDRESS,
    abi: CERTIFICATE_ABI,
    functionName: "verifyCertificateData",
    args:
      search !== null && Object.values(verificationInputs).every((v) => v.length > 0)
        ? [
            search,
            verificationInputs.recipient as `0x${string}`,
            verificationInputs.studentName,
            verificationInputs.courseName,
            verificationInputs.grade,
            verificationInputs.institution,
          ]
        : undefined,
    query: {
      enabled:
        search !== null && Object.values(verificationInputs).every((v) => v.length > 0),
    },
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenId) {
      setSearch(BigInt(tokenId));
    }
  };

  const [owner, timestamp, valid, dataHash] = certificateData || [];

  return (
    <main className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-emerald-600 via-cyan-600 to-transparent opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-green-900 bg-opacity-30 border border-green-700 border-opacity-50">
            <span className="text-green-400 text-sm font-semibold">✓ Verification Mode</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Verify Certificate
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Look up any certificate by its token ID and verify authenticity
          </p>
        </div>

        {/* Search Section */}
        <form onSubmit={handleVerify} className="mb-10">
          <div className="bg-emerald-950 bg-opacity-40 backdrop-blur-xl rounded-2xl border border-emerald-700 border-opacity-30 p-8">
            <label className="flex items-center gap-2 font-semibold text-gray-200 mb-4">
              <span className="text-2xl">🔍</span>
              Certificate Token ID
            </label>
            <div className="flex gap-4 flex-col md:flex-row">
              <input
                type="number"
                placeholder="e.g. 57284619 (8-digit random ID)"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="flex-1 bg-slate-800 bg-opacity-50 border border-emerald-600 border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-20"
                required
              />
              <button
                type="submit"
                disabled={isLoading || !tokenId}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-70"
              >
                {isLoading ? "Searching..." : "Look Up"}
              </button>
            </div>
          </div>
        </form>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-300 mt-4">Checking blockchain...</p>
          </div>
        )}

        {/* Certificate Info */}
        {certificateData && (
          <>
            {/* Status Header */}
            <div className="mb-10 bg-gradient-to-r from-emerald-900 via-cyan-900 to-emerald-900 bg-opacity-50 backdrop-blur-xl rounded-2xl border border-emerald-600 border-opacity-30 p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-gray-300 text-sm uppercase tracking-wider mb-2">Certificate Status</p>
                  <h2 className="text-3xl font-bold">Certificate #{tokenId}</h2>
                </div>
                <div className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 ${
                  valid
                    ? "bg-gradient-to-r from-green-900 to-emerald-900 text-green-300 border border-green-600 border-opacity-50"
                    : "bg-gradient-to-r from-red-900 to-pink-900 text-red-300 border border-red-600 border-opacity-50"
                }`}>
                  {valid ? (
                    <>
                      <span className="text-2xl">✓</span>
                      <span>VALID</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">✗</span>
                      <span>REVOKED</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Certificate Details Card */}
            <div className="bg-cyan-950 bg-opacity-40 backdrop-blur-xl rounded-2xl border border-cyan-700 border-opacity-30 p-8 mb-10">
              <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center gap-2">
                <span>📋</span>
                Certificate Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Owner Address</p>
                  <p className="text-white font-mono text-sm bg-black bg-opacity-30 p-3 rounded-lg overflow-auto">
                    {owner}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Issued Date</p>
                  <p className="text-white text-lg">
                    {timestamp ? new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Status</p>
                  <p className="text-lg">
                    {valid ? (
                      <span className="text-green-400 font-bold">Active & Valid</span>
                    ) : (
                      <span className="text-red-400 font-bold">Revoked</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Data Hash (for verification)</p>
                  <p className="text-white font-mono text-xs bg-black bg-opacity-30 p-3 rounded-lg overflow-auto">
                    {dataHash?.toString().substring(0, 24)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Data Verification Section */}
            <div className="bg-purple-950 bg-opacity-40 backdrop-blur-xl rounded-2xl border border-purple-700 border-opacity-30 p-8">
              <h3 className="text-2xl font-bold text-purple-300 mb-2 flex items-center gap-2">
                <span>🔐</span>
                Verify Certificate Data
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Enter the original certificate details to verify authenticity. Data must match exactly.
              </p>

              <div className="space-y-4">
                {[
                  { 
                    key: "recipient",
                    label: "Recipient Address",
                    placeholder: "0x...",
                    icon: "👤"
                  },
                  {
                    key: "studentName",
                    label: "Student Name",
                    placeholder: "e.g. Sarah Johnson",
                    icon: "✍️"
                  },
                  {
                    key: "courseName",
                    label: "Course Name",
                    placeholder: "e.g. Advanced Blockchain",
                    icon: "📚"
                  },
                  {
                    key: "grade",
                    label: "Grade",
                    placeholder: "e.g. A+",
                    icon: "⭐"
                  },
                  {
                    key: "institution",
                    label: "Institution",
                    placeholder: "e.g. Stanford University",
                    icon: "🏫"
                  },
                ].map(({ key, label, placeholder, icon }) => (
                  <div key={key}>
                    <label className="flex items-center gap-2 font-semibold text-gray-200 mb-2">
                      <span>{icon}</span>
                      {label}
                    </label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={verificationInputs[key as keyof typeof verificationInputs]}
                      onChange={(e) =>
                        setVerificationInputs({
                          ...verificationInputs,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full bg-slate-800 bg-opacity-50 border border-purple-600 border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-20 transition"
                    />
                  </div>
                ))}
              </div>

              {/* Verification Result */}
              {isDataValid !== undefined && (
                <div className={`mt-8 p-6 rounded-xl border-2 ${
                  isDataValid && valid
                    ? "bg-green-900 bg-opacity-40 border-green-600 border-opacity-50"
                    : "bg-red-900 bg-opacity-40 border-red-600 border-opacity-50"
                }`}>
                  {isDataValid && valid ? (
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">✅</span>
                      <div>
                        <h4 className="font-bold text-green-300 text-lg mb-2">
                          Certificate Verified!
                        </h4>
                        <p className="text-green-200">
                          This certificate data is authentic and has not been tampered with. The certificate is valid and has not been revoked.
                        </p>
                      </div>
                    </div>
                  ) : !valid ? (
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">🚫</span>
                      <div>
                        <h4 className="font-bold text-red-300 text-lg mb-2">
                          Certificate Revoked
                        </h4>
                        <p className="text-red-200">
                          This certificate has been revoked and is no longer valid. It cannot be used for any official purposes.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">⚠️</span>
                      <div>
                        <h4 className="font-bold text-red-300 text-lg mb-2">
                          Verification Failed
                        </h4>
                        <p className="text-red-200">
                          The certificate data you provided does not match the stored data. This indicates either incorrect data entry or certificate tampering. Data must match exactly.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
