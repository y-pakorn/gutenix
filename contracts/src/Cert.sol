// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

enum Status {
    Active,
    Expired,
    Revoked
}

interface ICertificateValidator {
    function checkCertificateStatus(
        address recipient,
        string memory certificateId
    )
        external
        view
        returns (bool exists, Status status, uint256 expiryTimestamp);
}

interface ICertificateMetadata {
    enum Level {
        Beginner,
        Intermediate,
        Advanced,
        Expert
    }

    function getCertificateInfo(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory certificateId,
            uint256 issueTimestamp,
            uint256 expiryTimestamp,
            Status status,
            Level level
        );
}

contract CertificateNFT is
    ERC721,
    Ownable,
    ICertificateMetadata,
    ICertificateValidator
{
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    struct Certificate {
        string certificateId;
        uint256 issueTimestamp;
        uint256 expiryTimestamp;
        Status status;
        Level level;
    }

    mapping(uint256 => Certificate) private _certificates;

    constructor() ERC721("Certificate", "CERT") Ownable(msg.sender) {}

    function generateTokenId(
        address recipient,
        string memory certificateId
    ) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(recipient, certificateId)));
    }

    function mint(
        address recipient,
        string memory certificateId,
        Level level,
        uint256 validityPeriod,
        bytes memory signature
    ) external {
        uint256 tokenId = generateTokenId(recipient, certificateId);
        require(!_exists(tokenId), "Certificate already exists");

        bytes32 messageHash = keccak256(
            abi.encodePacked(recipient, certificateId, level, validityPeriod)
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        require(signedHash.recover(signature) == owner(), "Invalid signature");

        uint256 expiryTimestamp = block.timestamp + validityPeriod;

        _certificates[tokenId] = Certificate({
            certificateId: certificateId,
            issueTimestamp: block.timestamp,
            expiryTimestamp: expiryTimestamp,
            status: Status.Active,
            level: level
        });

        _mint(recipient, tokenId);
    }

    function updateStatus(
        uint256 tokenId,
        Status newStatus
    ) external onlyOwner {
        require(_exists(tokenId), "Certificate does not exist");
        _certificates[tokenId].status = newStatus;
    }

    function checkAndUpdateExpiry(uint256 tokenId) public {
        require(_exists(tokenId), "Certificate does not exist");
        Certificate storage cert = _certificates[tokenId];
        if (
            cert.status == Status.Active &&
            block.timestamp > cert.expiryTimestamp
        ) {
            cert.status = Status.Expired;
        }
    }

    function getCertificateInfo(
        uint256 tokenId
    )
        external
        view
        override
        returns (
            string memory certificateId,
            uint256 issueTimestamp,
            uint256 expiryTimestamp,
            Status status,
            Level level
        )
    {
        require(_exists(tokenId), "Certificate does not exist");
        Certificate memory cert = _certificates[tokenId];

        Status currentStatus = cert.status;
        if (
            currentStatus == Status.Active &&
            block.timestamp > cert.expiryTimestamp
        ) {
            currentStatus = Status.Expired;
        }

        return (
            cert.certificateId,
            cert.issueTimestamp,
            cert.expiryTimestamp,
            currentStatus,
            cert.level
        );
    }
    function checkCertificateStatus(
        address recipient,
        string memory certificateId
    )
        external
        view
        returns (bool exists, Status status, uint256 expiryTimestamp)
    {
        uint256 tokenId = generateTokenId(recipient, certificateId);

        if (!_exists(tokenId)) {
            return (false, Status.Expired, 0);
        }

        Certificate memory cert = _certificates[tokenId];
        Status currentStatus = cert.status;
        if (
            currentStatus == Status.Active &&
            block.timestamp > cert.expiryTimestamp
        ) {
            currentStatus = Status.Expired;
        }

        return (true, currentStatus, cert.expiryTimestamp);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }
}
