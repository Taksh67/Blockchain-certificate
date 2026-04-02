import type { Address } from '@/types';

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export const CERTIFICATE_ABI = [
  {
    name: "issueCertificate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "studentName", type: "string" },
      { name: "courseName", type: "string" },
      { name: "grade", type: "string" },
      { name: "institution", type: "string" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "verifyCertificate",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "timestamp", type: "uint256" },
      { name: "valid", type: "bool" },
      { name: "dataHash", type: "bytes32" },
    ],
  },
  {
    name: "verifyCertificateData",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "studentName", type: "string" },
      { name: "courseName", type: "string" },
      { name: "grade", type: "string" },
      { name: "institution", type: "string" },
    ],
    outputs: [{ name: "isValid", type: "bool" }],
  },
  {
    name: "revokeCertificate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "isValid",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getCertificateHash",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "bytes32" }],
  },
  {
    name: "getIssuedAt",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "admin",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "CertificateIssued",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "recipient", type: "address", indexed: true },
      { name: "studentName", type: "string" },
      { name: "courseName", type: "string" },
      { name: "grade", type: "string" },
      { name: "institution", type: "string" },
      { name: "timestamp", type: "uint256" },
    ],
  },
  {
    name: "CertificateRevoked",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const;
