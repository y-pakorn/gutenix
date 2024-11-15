// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface from previous example
interface ICertificateValidator {
    enum Status {
        Active,
        Expired,
        Revoked
    }

    function checkCertificateStatus(
        address recipient,
        string memory certificateId
    )
        external
        view
        returns (bool exists, Status status, uint256 expiryTimestamp);
}

// Example: Trading platform that requires trader certification
contract CertifiedTrading {
    ICertificateValidator public certificateContract;
    mapping(address => uint256) public balances;

    // Certificate IDs required for different operations
    string public constant BASIC_TRADER_CERT = "BASIC_TRADER_2024";
    string public constant ADVANCED_TRADER_CERT = "ADVANCED_TRADER_2024";

    constructor(address _certificateContract) {
        certificateContract = ICertificateValidator(_certificateContract);
    }

    modifier onlyCertified(string memory certificateId) {
        (
            bool exists,
            ICertificateValidator.Status status,
            uint256 expiryTimestamp
        ) = certificateContract.checkCertificateStatus(
                msg.sender,
                certificateId
            );

        require(exists, "Certificate not found");
        require(
            status == ICertificateValidator.Status.Active,
            "Certificate not active"
        );
        require(block.timestamp <= expiryTimestamp, "Certificate expired");
        _;
    }

    // Basic trading functions require basic certification
    function placeTrade(
        uint256 amount
    ) external onlyCertified(BASIC_TRADER_CERT) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        // Trading logic
    }

    // Advanced operations require advanced certification
    function placeComplexTrade(
        uint256 amount,
        bytes calldata data
    ) external onlyCertified(ADVANCED_TRADER_CERT) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        // Complex trading logic
    }
}
