## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
source .env


forge script --chain sepolia --rpc-url https://1rpc.io/sepolia  script/deploy.s.sol:MyScript --broadcast --verify -vvvv

forge script --rpc-url https://1rpc.io/sepolia  script/deploy.s.sol:MyScript --broadcast --verify

forge script --rpc-url https://rpc-testnet.bitkubchain.io  script/deploy.s.sol:MyScript --broadcast --verify


forge script --rpc-url https://rpc-amoy.polygon.technology  script/deploy.s.sol:MyScript --broadcast --legacy

forge script --rpc-url https://testnet.evm.nodes.onflow.org script/deploy.s.sol:MyScript --broadcast --legacy


forge script --rpc-url https://sepolia-rpc.scroll.io/ script/deploy.s.sol:MyScript --broadcast --legacy

forge script --rpc-url https://zircuit1-testnet.p2pify.com/ script/deploy.s.sol:MyScript --broadcast --legacy


forge script --rpc-url https://base-sepolia.gateway.tenderly.co/ script/deploy.s.sol:MyScript --broadcast --legacy

forge script --rpc-url https://base-sepolia.gateway.tenderly.co/ script/deploy.s.sol:MyScript --broadcast --legacy


forge script --rpc-url https://rpc-holesky.morphl2.io/ script/deploy.s.sol:MyScript --broadcast --legacy


forge script --rpc-url https://linea-sepolia.blockpi.network/v1/rpc/public script/deploy.s.sol:MyScript --broadcast --legacy




forge verify-contract 0x1995ee7c84e01fe47a54d272a32e87ab84e59f32 src/Cert.sol:CertificateNFT --show-standard-json-input > verify.json