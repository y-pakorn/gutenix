// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface ICertificateMetadata {
    enum Status {
        Active,
        Expired,
        Revoked
    }
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

contract CertificateNFT is ERC721, Ownable, ICertificateMetadata {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    Counters.Counter private _tokenIds;

    struct Certificate {
        string certificateId;
        uint256 issueTimestamp;
        uint256 expiryTimestamp;
        Status status;
        Level level;
    }

    mapping(uint256 => Certificate) private _certificates;

    constructor() ERC721("Certificate", "CERT") Ownable(msg.sender) {}

    function mint(
        address recipient,
        string memory certificateId,
        Level level,
        uint256 validityPeriod,
        bytes memory signature
    ) external {
        bytes32 messageHash = keccak256(
            abi.encodePacked(recipient, certificateId, level, validityPeriod)
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        require(signedHash.recover(signature) == owner(), "Invalid signature");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        uint256 expiryTimestamp = block.timestamp + validityPeriod;

        _certificates[newTokenId] = Certificate({
            certificateId: certificateId,
            issueTimestamp: block.timestamp,
            expiryTimestamp: expiryTimestamp,
            status: Status.Active,
            level: level
        });

        _mint(recipient, newTokenId);
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

        // Check expiry without modifying state
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
}
