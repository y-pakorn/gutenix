import { Address, encodePacked, keccak256, parseAbi } from "viem"

export const CERTIFICATE_ABI = parseAbi([
  "function getCertificateInfo(uint256 tokenId) external view returns (string memory certificateId, uint256 issueTimestamp, uint256 expiryTimestamp, uint8 status, uint8 level)",
  "function mint(address recipient, string memory certificateId, uint8 level, uint256 validityPeriod, uint256 price, bytes memory signature) external payable",
  "event CertificateMinted(address indexed recipient, string indexed certificateId, uint8 level, uint256 validityPeriod, uint256 price)",
])

export const getCertificateId = (address: Address, courseId: string) => {
  return keccak256(encodePacked(["address", "string"], [address, courseId]))
}
