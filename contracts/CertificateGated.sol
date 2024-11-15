// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

contract CertificateGated {
    ICertificateValidator public certificateContract;

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
}
