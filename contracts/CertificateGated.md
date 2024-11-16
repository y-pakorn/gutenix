# on chain integration guide
Integration guide for the Certification NFT contract that verifies professional certifications on-chain. Each NFT contains certification ID, issue time, expire time, and status (active, expired, revoked).

## Access data
#### ICertificateValidator
``` solidity
interface ICertificateValidator {
    function checkCertificateStatus(
        address recipient,
        string memory certificateId
    )
        external
        view
        returns (bool exists, Status status, uint256 expiryTimestamp);
}
```
#### ICertificateMetadata
``` solidity

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
```

## modifier usage

#### CertificateGated
``` solidity

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
```

### example use case

``` solidity

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

```