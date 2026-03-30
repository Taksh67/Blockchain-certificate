"use client";
import { useState } from "react";
import { useReadContract } from "wagmi";
import { CERTIFICATE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

export default function VerifyCertificate() {
  const [tokenId, setTokenId] = useState("");
  const [search, setSearch] = useState<bigint | null>(null);

  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CERTIFICATE_ABI,
    functionName: "verify_certificate",
    args: search !== null ? [search] : undefined,
    query: { enabled: search !== null },
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(BigInt(tokenId));
  };

  const cert = data as [string, string, string, string, bigint, boolean] | undefined;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-green-400">Verify Certificate</h1>
        <p className="text-gray-400 mb-8">Enter a Certificate Token ID to verify its authenticity</p>
        <form onSubmit={handleVerify} className="flex gap-3 mb-8">
          <input
            type="number"
            placeholder="Enter Certificate Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition"
          >
            Verify
          </button>
        </form>
        {isLoading && <p className="text-gray-400">Checking blockchain...</p>}
        {isError && (
          <div className="p-4 bg-red-800 rounded-lg text-red-200">
            Certificate not found or invalid Token ID.
          </div>
        )}
        {cert && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Certificate Details</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                cert[5] ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"
              }`}>
                {cert[5] ? "VALID" : "REVOKED"}
              </span>
            </div>
            <div className="space-y-3 text-gray-300">
              <p><span className="text-gray-500">Student:</span> {cert[0]}</p>
              <p><span className="text-gray-500">Course:</span> {cert[1]}</p>
              <p><span className="text-gray-500">Grade:</span> {cert[2]}</p>
              <p><span className="text-gray-500">Institution:</span> {cert[3]}</p>
              <p><span className="text-gray-500">Issued On:</span> {new Date(Number(cert[4]) * 1000).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
