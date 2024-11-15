// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Cert.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract CertificateNFTTest is Test {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    CertificateNFT public certificateNFT;
    address public owner;
    address public recipient;
    uint256 public ownerPrivateKey;
    uint256 public price = 0;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    function setUp() public {
        ownerPrivateKey = 0xA11CE;
        owner = vm.addr(ownerPrivateKey);
        recipient = address(vm.addr(0xBEEF));

        vm.startPrank(owner);
        certificateNFT = new CertificateNFT();
        vm.stopPrank();
    }

    function testMintCertificate() public {
        string memory certificateId = "CERT-001";
        ICertificateMetadata.Level level = ICertificateMetadata.Level.Advanced;
        uint256 validityPeriod = 365 days;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                recipient,
                certificateId,
                level,
                validityPeriod,
                price
            )
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, signedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        uint256 expectedTokenId = certificateNFT.generateTokenId(
            recipient,
            certificateId
        );

        vm.expectEmit(true, true, true, true);
        emit Transfer(address(0), recipient, expectedTokenId);

        certificateNFT.mint(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            signature
        );

        assertEq(certificateNFT.ownerOf(expectedTokenId), recipient);
    }

    function testCannotMintDuplicateCertificate() public {
        string memory certificateId = "CERT-001";
        ICertificateMetadata.Level level = ICertificateMetadata.Level.Advanced;
        uint256 validityPeriod = 365 days;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                recipient,
                certificateId,
                level,
                validityPeriod,
                price
            )
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, signedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // First mint should succeed
        certificateNFT.mint(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            signature
        );

        // Second mint should fail
        vm.expectRevert("Certificate already exists");
        certificateNFT.mint(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            signature
        );
    }

    function testCannotMintWithInvalidSignature() public {
        string memory certificateId = "CERT-001";
        ICertificateMetadata.Level level = ICertificateMetadata.Level.Advanced;
        uint256 validityPeriod = 365 days;

        uint256 wrongPrivateKey = 0xBAD;
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                recipient,
                certificateId,
                level,
                validityPeriod,
                price
            )
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongPrivateKey, signedHash);
        bytes memory wrongSignature = abi.encodePacked(r, s, v);

        vm.expectRevert("Invalid signature");
        certificateNFT.mint(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            wrongSignature
        );
    }

    function testUpdateStatus() public {
        // First mint a certificate
        string memory certificateId = "CERT-001";
        ICertificateMetadata.Level level = ICertificateMetadata.Level.Advanced;
        uint256 validityPeriod = 365 days;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                recipient,
                certificateId,
                level,
                validityPeriod,
                price
            )
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, signedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        uint256 tokenId = certificateNFT.generateTokenId(
            recipient,
            certificateId
        );
        // send eth to mint
        certificateNFT.mint(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            signature
        );

        // Update status to revoked
        vm.prank(owner);
        certificateNFT.updateStatus(tokenId, Status.Revoked);

        // Check the new status
        (, , , Status status, ) = certificateNFT.getCertificateInfo(tokenId);
        assertEq(uint(status), uint(Status.Revoked));
    }

    function testCertificateExpiry() public {
        string memory certificateId = "CERT-001";
        ICertificateMetadata.Level level = ICertificateMetadata.Level.Advanced;
        uint256 validityPeriod = 365 days;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                recipient,
                certificateId,
                level,
                validityPeriod,
                price
            )
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, signedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        uint256 tokenId = certificateNFT.generateTokenId(
            recipient,
            certificateId
        );
        certificateNFT.mint(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            signature
        );

        // Check initial status
        (, , , Status initialStatus, ) = certificateNFT.getCertificateInfo(
            tokenId
        );
        assertEq(uint(initialStatus), uint(Status.Active));

        // Warp time forward past validity period
        vm.warp(block.timestamp + validityPeriod + 1);

        // Check expired status
        (, , , Status expiredStatus, ) = certificateNFT.getCertificateInfo(
            tokenId
        );
        assertEq(uint(expiredStatus), uint(Status.Expired));
    }

    function testCheckCertificateStatus() public {
        string memory certificateId = "CERT-001";
        ICertificateMetadata.Level level = ICertificateMetadata.Level.Advanced;
        uint256 validityPeriod = 365 days;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                recipient,
                certificateId,
                level,
                validityPeriod,
                price
            )
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, signedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Mint certificate
        certificateNFT.mint(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            signature
        );

        // Check status for existing certificate
        (bool exists, Status status, uint256 expiry) = certificateNFT
            .checkCertificateStatus(recipient, certificateId);
        assertTrue(exists);
        assertEq(uint(status), uint(Status.Active));
        assertEq(expiry, block.timestamp + validityPeriod);

        // Check status for non-existent certificate
        (exists, status, expiry) = certificateNFT.checkCertificateStatus(
            recipient,
            "NON-EXISTENT"
        );
        assertFalse(exists);
        assertEq(uint(status), uint(Status.Expired));
        assertEq(expiry, 0);
    }

    function testPricedCertificate() public {
        string memory certificateId = "CERT-001";
        ICertificateMetadata.Level level = ICertificateMetadata.Level.Advanced;
        uint256 validityPeriod = 365 days;
        price = 1 ether;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                recipient,
                certificateId,
                level,
                validityPeriod,
                price
            )
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, signedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        uint256 tokenId = certificateNFT.generateTokenId(
            recipient,
            certificateId
        );
        certificateNFT.mint{value: 1 ether}(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            signature
        );

        // Check initial status
        (, , , Status initialStatus, ) = certificateNFT.getCertificateInfo(
            tokenId
        );
        assertEq(uint(initialStatus), uint(Status.Active));

        // Warp time forward past validity period
        vm.warp(block.timestamp + validityPeriod + 1);

        // Check expired status
        (, , , Status expiredStatus, ) = certificateNFT.getCertificateInfo(
            tokenId
        );
        assertEq(uint(expiredStatus), uint(Status.Expired));
    }

    function testNotPaying() public {
        string memory certificateId = "CERT-001";
        ICertificateMetadata.Level level = ICertificateMetadata.Level.Advanced;
        uint256 validityPeriod = 365 days;
        price = 1 ether;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                recipient,
                certificateId,
                level,
                validityPeriod,
                price
            )
        );
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, signedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        uint256 tokenId = certificateNFT.generateTokenId(
            recipient,
            certificateId
        );

        vm.expectRevert("Invalid price");
        certificateNFT.mint{value: 0}(
            recipient,
            certificateId,
            level,
            validityPeriod,
            price,
            signature
        );
    }
}
