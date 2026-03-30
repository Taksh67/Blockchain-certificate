"use client";
import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { CERTIFICATE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

export default function IssueCertificate() {
  const { isConnected, address } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();

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
      functionName: "issue_certificate",
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Please connect your wallet to issue certificates.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-blue-400">Issue Certificate</h1>
        <p className="text-gray-400 mb-8">Mint a new NFT certificate to a student wallet</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Student Wallet Address", key: "recipient",   placeholder: "0x..." },
            { label: "Student Name",           key: "studentName", placeholder: "e.g. Taksh Padmani" },
            { label: "Course Name",            key: "courseName",  placeholder: "e.g. Blockchain Technology" },
            { label: "Grade",                  key: "grade",       placeholder: "e.g. A+" },
            { label: "Institution",            key: "institution", placeholder: "e.g. CHARUSAT University" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm text-gray-300 mb-1">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
          >
            {isPending ? "Issuing..." : "Issue Certificate as NFT"}
          </button>
        </form>
        {isSuccess && (
          <div className="mt-6 p-4 bg-green-800 rounded-lg text-green-200">
            Certificate successfully issued on the blockchain!
          </div>
        )}
      </div>
    </div>
  );
}
