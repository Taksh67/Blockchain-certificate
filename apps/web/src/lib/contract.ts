import type { Address } from '@/types';

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export const CERTIFICATE_ABI = [
  {
    name: "issue_certificate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient",    type: "address" },
      { name: "student_name", type: "string"  },
      { name: "course_name",  type: "string"  },
      { name: "grade",        type: "string"  },
      { name: "institution",  type: "string"  },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "verify_certificate",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "token_id", type: "uint256" }],
    outputs: [
      { name: "student_name", type: "string"  },
      { name: "course_name",  type: "string"  },
      { name: "grade",        type: "string"  },
      { name: "institution",  type: "string"  },
      { name: "issued_at",    type: "uint256" },
      { name: "is_valid",     type: "bool"    },
    ],
  },
  {
    name: "revoke_certificate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "token_id", type: "uint256" }],
    outputs: [],
  },
  {
    name: "total_supply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;
