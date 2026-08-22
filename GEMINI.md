# WDK Development Rules

## Package Structure
- All WDK packages are published under the `@tetherto` scope on npm.
- Core module: `@tetherto/wdk`.
- Wallet modules follow the pattern: `@tetherto/wdk-wallet-<chain>`.
  - Examples: `@tetherto/wdk-wallet-evm`, `@tetherto/wdk-wallet-btc`, `@tetherto/wdk-wallet-solana`, `@tetherto/wdk-wallet-ton`, `@tetherto/wdk-wallet-tron`, `@tetherto/wdk-wallet-spark`.
- Specialized wallet modules: `@tetherto/wdk-wallet-evm-erc-4337`, `@tetherto/wdk-wallet-ton-gasless`, `@tetherto/wdk-wallet-tron-gasfree`.
- Protocol modules follow the pattern: `@tetherto/wdk-protocol-<type>-<name>-<chain>`.
  - Examples: `@tetherto/wdk-protocol-swap-velora-evm`, `@tetherto/wdk-protocol-bridge-usdt0-evm`, `@tetherto/wdk-protocol-lending-aave-evm`.

## Platform Notes
- For Node.js or Bare runtime: use `@tetherto/wdk` as the orchestrator, then register individual wallet modules.
- For React Native: use the React Native provider package for convenience, or use WDK packages directly in the Hermes runtime.

## Architecture
- WDK is modular: each blockchain and protocol is a separate npm package.
- Wallet modules expose `WalletManager`, `WalletAccount`, and `WalletAccountReadOnly` classes.
- `WalletAccount` extends `WalletAccountReadOnly`, so it has all read-only methods plus write methods such as sign and send.
- All modules follow a consistent pattern: configuration, initialization, usage.

## Documentation
- Official docs: [docs.wdk.tether.io](https://docs.wdk.tether.io)
- For any WDK question, consult the official documentation before making assumptions.
- API references, configuration guides, and usage examples are available for every module.
