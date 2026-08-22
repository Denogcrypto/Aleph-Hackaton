# Autonomous Payroll Agents

## Overview

Un sistema de agentes autónomos que permite automatizar el proceso de pago de salarios entre una empresa y sus empleados utilizando x402 como protocolo de payment requirements y WDK (Wallet Development Kit) de Tether para la creación y gestión de wallets y flujos de pago.

La idea central es llevar el concepto de payroll a un modelo agent-to-agent, donde el empleado y la empresa están representados por agentes capaces de detectar eventos, solicitar pagos y ejecutarlos de forma autónoma.

## 💡 Idea

Actualmente, el pago de salarios requiere que una persona o un sistema centralizado:

- determine cuándo corresponde realizar el pago;
- calcule cuánto debe recibir cada empleado;
- genere la orden de pago;
- ejecute la transferencia;
- verifique que el empleado recibió el dinero.

Nuestro proyecto busca que este flujo sea ejecutado directamente por agentes autónomos.

Tenemos dos tipos de agentes:

- 🤖 Employee Agent: representa al empleado.
- 🏢 Company Agent: representa a la empresa.

Estos agentes interactúan entre sí utilizando x402, mientras que WDK proporciona la infraestructura de wallets necesaria para realizar y recibir los pagos.

## 🔄 ¿Cómo funciona?

Imaginemos que el salario de un empleado debe pagarse el día 1 de cada mes.

### 1. Llega la fecha de pago

El Employee Agent detecta que llegó la fecha correspondiente al pago.

Ejemplo:

- Fecha actual: 1 de septiembre
- Evento: Payroll due

El agente sabe que existe un pago pendiente por parte de la empresa.

### 2. Employee Agent → Company Agent

El agente del empleado genera un Payment Requirement utilizando el protocolo x402.

Conceptualmente:

```text
Employee Agent
      │
      │  x402 Payment Requirement
      │  "Pay 1,000 USDT"
      ▼
Company Agent
```

El requerimiento contiene la información necesaria para que el agente de la empresa pueda procesar el pago.

Ejemplo:

```json
{
  "recipient": "employee_wallet",
  "asset": "USDT",
  "amount": "1000",
  "payment_reason": "Monthly salary",
  "due_date": "2026-09-01"
}
```

La estructura final dependerá de cómo implementemos x402 y de la red utilizada.

### 3. Company Agent procesa el requerimiento

El Company Agent recibe el Payment Requirement y puede verificar:

- identidad del empleado;
- monto correspondiente;
- fecha de pago;
- estado del payroll;
- wallet destino;
- disponibilidad de fondos.

Si todo es correcto, el agente autoriza y ejecuta el pago.

```text
Payment Requirement
Employee Agent ─────────────────────────────► Company Agent
                                            │
                                            │ Verify
                                            ▼
                                      Execute Payment
                                            │
                                            ▼
                                      Blockchain
```

### 4. Se ejecuta el pago

El Company Agent utiliza una wallet administrada mediante WDK para realizar la transferencia.

```text
Company Wallet
      │
      │  USDT
      ▼
Employee Wallet
```

La transacción queda registrada on-chain.

### 5. Employee Agent recibe el pago

La wallet asociada al empleado recibe los fondos.

```text
Employee Agent
      │
      ▼
Employee Wallet
      │
      ▼
   1,000 USDT
```

El agente puede detectar la recepción del pago y actualizar el estado:

```text
Requested → Approved → Paid → Received
```

## 🧠 Arquitectura

El sistema está compuesto principalmente por cuatro componentes:

```text
┌──────────────────────┐      x402      ┌──────────────────────┐
│    Employee Agent    │ ───────────────► │    Company Agent     │
│                      │                 │                      │
│ - Payroll tracking   │                 │ - Verify request     │
│ - Payment requests   │                 │ - Approve payroll    │
│ - Wallet monitoring  │                 │ - Execute payment    │
└──────────┬───────────┘                 └──────────┬───────────┘
           │                                         │
           │                                         │
           ▼                                         ▼
      ┌──────────────┐                         ┌──────────────┐
      │      WDK     │                         │  Blockchain  │
      │ Wallet Dev.  │                         │              │
      │     Kit      │                         │     USDT     │
      └──────┬───────┘                         └──────┬───────┘
             │                                         │
             ▼                                         ▼
      Employee Wallet                             Employee Wallet
```

## ⚡ x402

x402 se utiliza como la capa de comunicación para establecer el requerimiento de pago entre los agentes.

En nuestro caso, queremos utilizar el concepto de HTTP 402 / Payment Required para permitir que un agente pueda solicitar un pago a otro agente de manera programática.

La interacción conceptual sería:

```text
Employee Agent
      │
      │  "Payment Required"
      │
      │  1,000 USDT
      ▼
Company Agent
      │
      │  Validate
      │
      │  Pay
      ▼
Blockchain
```

Esto nos permite pensar el payroll no como una transferencia iniciada manualmente por una persona, sino como una interacción económica entre agentes autónomos.

## 👛 WDK — Wallet Development Kit

Utilizaremos WDK (Wallet Development Kit) para la infraestructura relacionada con wallets y pagos.

WDK nos permitirá explorar:

- creación de wallets;
- gestión de wallets de los agentes;
- recepción de fondos;
- envío de fondos;
- flujos de pago programáticos;
- integración de USDT;
- interacción con blockchain.

La arquitectura propuesta sería:

```text
Employee Agent
      │
      └──── Employee Wallet
                  ▲
                  │
              USDT Payment
                  │
                  ▼
              Company Wallet
                  │
                  └──── Company Agent
```

De esta forma, cada agente puede tener una identidad económica propia.

## 🤖 Autonomous Agents

Uno de los objetivos principales del proyecto es que los agentes no sean simplemente interfaces para ejecutar acciones manuales.

Queremos que puedan tomar acciones de manera autónoma basándose en eventos y reglas predefinidas.

### Employee Agent

El agente del empleado podría:

- tener asociada una wallet;
- conocer su calendario de pagos;
- detectar cuándo corresponde cobrar;
- generar un Payment Requirement;
- enviarlo al Company Agent;
- esperar la confirmación del pago;
- detectar la recepción de los fondos;
- mantener un historial de pagos.

Ejemplo:

```text
IF today == payroll_date
    ↓
Create payment requirement
    ↓
Send to Company Agent
    ↓
Wait for payment
    ↓
Detect USDT transfer
    ↓
Mark payroll as received
```

### Company Agent

El agente de la empresa podría:

- mantener una wallet corporativa;
- recibir Payment Requirements;
- validar solicitudes;
- verificar montos;
- verificar empleados autorizados;
- comprobar disponibilidad de fondos;
- ejecutar pagos;
- registrar las transacciones.

Ejemplo:

```text
Receive Payment Requirement
          ↓
Verify employee
          ↓
Verify amount
          ↓
Verify payroll date
          ↓
Check balance
          ↓
Approve payment
          ↓
Send USDT
          ↓
Return payment confirmation
```

## 🔐 Trust & Verification

Una parte importante del proyecto es evitar que cualquier agente pueda solicitar dinero arbitrariamente.

Por eso, el Company Agent debe validar el requerimiento antes de realizar un pago.

Podemos implementar reglas como:

```text
Employee ID
     +
Wallet Address
     +
Salary
     +
Payment Date
     +
Company Authorization
     ↓
Valid Payment Requirement
```

Por ejemplo:

```json
{
  "employee_id": "employee_001",
  "wallet": "0x...",
  "amount": "1000",
  "currency": "USDT",
  "payment_date": "2026-09-01"
}
```

El Company Agent solamente ejecutará el pago si el request coincide con la información registrada.

## 🔁 End-to-End Flow

El flujo completo del sistema sería:

```text
MONTHLY PAYROLL
        │
        ▼
Employee Agent
        │
        │ Detect payroll date
        ▼
Create x402 Payment Request
        │
        ▼
Company Agent
        │
        │ Validate
        ▼
Approve
        │
        │ WDK
        ▼
Company Wallet
        │
        │ USDT
        ▼
Employee Wallet
        │
        ▼
Employee Agent
        │
        │ Payment Received
```

## 🛠️ Proposed Tech Stack

| Component | Technology |
| --- | --- |
| Autonomous Agents | AI Agents |
| Payment Protocol | x402 |
| Wallet Infrastructure | WDK |
| Stablecoin | USDT |
| Blockchain | TBD |
| Backend | TBD |
| Agent Communication | HTTP / APIs |
| Smart Contracts | TBD |

La blockchain y otros componentes de infraestructura podrán definirse dependiendo de la red que mejor se adapte a x402 + WDK para el hackathon.

## 🎯 MVP

Para el hackathon proponemos construir un MVP que demuestre el flujo completo con un empleado y una empresa.

### Employee Agent

1. Crear wallet
2. Configurar salario
3. Configurar fecha de pago
4. Detectar fecha
5. Crear x402 Payment Requirement
6. Enviar request
7. Detectar pago

### Company Agent

1. Crear wallet
2. Recibir Payment Requirement
3. Validar empleado
4. Validar monto
5. Ejecutar pago
6. Obtener transaction hash
7. Devolver confirmación

## Resultado esperado

```text
Employee Agent ───── x402 ─────► Company Agent ───── WDK ─────► USDT Payment ─────► Employee Wallet
```

## 🚀 Vision

Nuestro objetivo no es solamente automatizar un payroll.

Queremos explorar un futuro donde los agentes de IA puedan tener wallets, interactuar entre sí y ejecutar transacciones financieras de manera autónoma.

En este modelo:

Employees don't request money from companies. Their agents negotiate, request and settle payments autonomously.

Esto convierte el payroll en una interacción agent-to-agent, utilizando:

AI Agents + x402 + WDK + USDT + Blockchain

para construir una nueva generación de sistemas de pagos autónomos.


# @tetherto/wdk

[![npm version](https://img.shields.io/npm/v/%40tetherto%2Fwdk?style=flat-square)](https://www.npmjs.com/package/@tetherto/wdk)
[![npm downloads](https://img.shields.io/npm/dw/%40tetherto%2Fwdk?style=flat-square)](https://www.npmjs.com/package/@tetherto/wdk)
[![license](https://img.shields.io/npm/l/%40tetherto%2Fwdk?style=flat-square)](https://github.com/tetherto/wdk/blob/main/LICENSE)
[![docs](https://img.shields.io/badge/docs-docs.wdk.tether.io-0A66C2?style=flat-square)](https://docs.wdk.tether.io/sdk/core-module)

**Note**: This package is currently in beta. Please test thoroughly in development environments before using in production.

A flexible manager for orchestrating WDK wallet and protocol modules through a single interface. This package lets you register blockchain-specific wallet managers, derive accounts, and coordinate multi-chain wallet flows from one WDK instance.

## About WDK

This module is part of the [**WDK (Wallet Development Kit)**](https://docs.wdk.tether.io/) project, which empowers developers to build secure, non-custodial wallets with unified blockchain access, stateless architecture, and complete user control.

For detailed documentation about the complete WDK ecosystem, visit [docs.wdk.tether.io](https://docs.wdk.tether.io).

## Installation

```bash
npm install @tetherto/wdk
```

## Quick Start

```javascript
import WDK from '@tetherto/wdk'
import WalletManagerSolana from '@tetherto/wdk-wallet-solana'
import WalletManagerTon from '@tetherto/wdk-wallet-ton'
import WalletManagerTron from '@tetherto/wdk-wallet-tron'

const seedPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'

const wdk = new WDK(seedPhrase)
  .registerWallet('solana', WalletManagerSolana, {
    rpcUrl: 'https://api.devnet.solana.com',
    commitment: 'confirmed',
  })
  .registerWallet('ton', WalletManagerTon, {
    tonClient: { url: 'https://testnet.toncenter.com/api/v2/jsonRPC' },
  })
  .registerWallet('tron', WalletManagerTron, {
    provider: 'https://api.shasta.trongrid.io',
  })

const account = await wdk.getAccount('solana', 0)
const address = await account.getAddress()
console.log('Address:', address)

wdk.dispose()
```

## Key Capabilities

- **Wallet Registration**: Register multiple blockchain wallet managers through one WDK instance
- **Unified Account Access**: Retrieve accounts by chain, index, or derivation path through a consistent API
- **Multi-Chain Operations**: Coordinate balances, fee lookups, and transaction flows across registered chains
- **Protocol Registration Support**: Attach swap, bridge, lending, fiat, and swidge protocols to registered blockchains
- **Middleware Hooks**: Intercept account derivation with custom middleware
- **Transaction Policies**: Local policy engine that intercepts write-facing operations and enforces user-defined ALLOW/DENY rules at project (global or wallet-bound) and account scopes — with simulation, nested-call handling, and structured `PolicyViolationError`s
- **Seed Utilities**: Generate and validate BIP-39 seed phrases
- **Selective Disposal**: Dispose specific registered wallets or clear the full WDK instance

## Transaction Policies

Register policies on a `WDK` instance to gate write-facing operations on every wallet account. Each registered rule can `ALLOW` or `DENY` an attempted operation based on a condition function; matching `DENY`s throw a `PolicyViolationError` before the underlying method runs.

```javascript
import WDK, { PolicyViolationError } from '@tetherto/wdk'
import WalletManagerEvm from '@tetherto/wdk-wallet-evm'

const wdk = new WDK(seedPhrase)
  .registerWallet('ethereum', WalletManagerEvm, { provider: '...' })
  .registerPolicy({
    id: 'value-cap',
    name: 'Cap value at 1 ETH',
    scope: 'project',
    rules: [{
      name: 'allow-under-1-eth',
      operation: 'sendTransaction',
      action: 'ALLOW',
      conditions: [({ args }) => BigInt(args[0].value) <= 10n ** 18n]
    }]
  })

const account = await wdk.getAccount('ethereum', 0)

try {
  await account.sendTransaction({ to: '0x…', value: 5n * 10n ** 18n })
} catch (err) {
  if (err instanceof PolicyViolationError) {
    console.log(err.policyId, err.ruleName, err.reason)
  }
}

// Run the same evaluation without executing the transaction.
const result = await account.simulate.sendTransaction({ to: '0x…', value: 1n })
// → { decision: 'ALLOW' | 'DENY', policy_id, matched_rule, reason, trace }
```

Policies have two scopes — `project` and `account`. A project-scope policy applies globally by default, or only to the wallets named in its `wallet` field (`wallet: 'ethereum'` or `wallet: ['ethereum', 'ton']`). The `wallet` value is the same string passed to `registerWallet`. It might be a chain name like `"ethereum"`, but it could equally be `"treasury-cold"` or any label the consumer chose; the engine treats it as an opaque key. An account-scope policy must declare a `wallet` and targets specific accounts within it, identified by either derivation path (`accounts: ["0'/0/0"]`) or integer index (`accounts: [0, 1]`) — index entries match accounts retrieved via `wdk.getAccount(wallet, index)`; path entries match either retrieval style. Evaluation is narrowest-first with `DENY` winning across scopes. Account-scope `ALLOW` rules can opt into `override_broader_scope: true` to short-circuit broader policies for explicit exceptions (e.g., treasury accounts). Conditions can be sync or async and may carry user-owned state via closures. Templates (`@tetherto/wdk-policy-templates`) and a portal UI for editing policies are coming in later phases.

### Condition context

Every condition receives a single frozen context object with four fields: `operation` (the intercepted operation name), `wallet` (the identifier the account belongs to — the same string passed to `registerWallet`), `account` (a read-only view exposing reads and quotes but no signing or write methods), and `args` (the full argument array the call was made with, snapshotted at evaluation time).

Arguments are read positionally through `args`, which works for every operation shape — including multi-argument ones:

```javascript
// sendTransaction(tx) — the transaction is args[0]
conditions: [({ args }) => BigInt(args[0].value) <= 10n ** 18n]

// swidge(options, config) — slippage lives on options, the fee caps on config
conditions: [({ args }) => args[0].slippage <= 0.05]
conditions: [({ args }) => args[1] !== undefined && args[1].maxProtocolFeeBps <= 50]
```

Index positionally against the operation's real signature, and remember that trailing arguments are often optional — `swidge`'s `config` is. Reading a field off an argument that wasn't passed throws, and reading one that lives on a different argument silently yields `undefined`, which compares falsy: either way the rule stops guarding what you think it guards. Check the argument exists before reaching into it.

> **Breaking change:** `context.params`, a shortcut for `args[0]`, has been removed. It was invisible past the first argument, so multi-argument operations had to reach for `args` anyway. Migrate positional access to `args`:
>
> ```javascript
> // Before
> conditions: [({ params }) => params.to === '0x…']
>
> // After
> conditions: [({ args }) => args[0].to === '0x…']
> ```

### Default-deny semantics

The engine is **default-deny on governed accounts**. As soon as any policy applies to an account, the engine wraps every method in `OPERATIONS` (the set of write-facing and signing primitives — `sendTransaction`, `signTransaction`, `transfer`, `approve`, `sign`, `signTypedData`, `signAuthorization`, `delegate`, `revokeDelegation`, and protocol methods like `swap`, `bridge`, `swidge`, etc.) on that account. Any call to a wrapped method whose operation is not addressed by an `ALLOW` rule throws `PolicyViolationError` with `reason: 'no-applicable-rule'`.

This is intentional: a "cap transfer at $100" policy must not be sidesteppable by `sendTransaction({ to: token, data: <ERC-20 transfer calldata> })`, `approve(spender, MAX)`, an off-chain `signTypedData` Permit, or an ERC-7702 `delegate` to an attacker contract. The engine closes those bypasses by treating any unaddressed money-movement op on a governed account as DENY.

If you want permissive semantics on a specific account (allow anything that isn't explicitly denied), register a wildcard ALLOW rule as a baseline and layer specific DENYs on top:

```javascript
wdk.registerPolicy({
  id: 'permissive-baseline',
  scope: 'project',
  rules: [
    { name: 'allow-all', operation: '*', action: 'ALLOW', conditions: [] },
    { name: 'block-bad', operation: 'sendTransaction', action: 'DENY', conditions: [({ args }) => isSanctioned(args[0].to)] }
  ]
})
```

Accounts that have **no** registered policies are not governed — the proxy is not applied, and method calls go straight to the underlying account at zero cost.

The engine wraps accounts through an ES `Proxy` so internal SDK code that uses `this.method()` naturally bypasses enforcement — nested-call escape (e.g. `bridge` internally calling `sendTransaction`) works without any async-context tracking. The same code path runs on every JavaScript runtime that supports `Proxy`, including Bare.

Policy enforcement applies to the **surface of the proxy** returned by `getAccount` / `getAccountByPath`. Reaching for underscore-prefixed fields (e.g. `protocol._account`) bypasses enforcement by design — treat them as private. The same applies to account-level operations invoked from inside a protocol's own methods (e.g. `bridge.bridge(...)` internally calling `this._account.sendTransaction(...)`), which is the documented nested-call escape; it lets protocols use the account they were constructed with without re-entering the engine on every internal step.

## Compatibility

- **WDK Wallet Modules** including EVM, Solana, TON, TRON, and Bitcoin integrations
- **Protocol Modules** registered through the WDK interface
- **Node.js and ESM-based applications** that coordinate multiple wallet modules in one runtime

## Documentation

| Topic | Description | Link |
|-------|-------------|------|
| Overview | Module overview and feature summary | [WDK Core Overview](https://docs.wdk.tether.io/sdk/core-module) |
| Usage | End-to-end integration walkthrough | [WDK Core Usage](https://docs.wdk.tether.io/sdk/core-module/usage) |
| Configuration | Wallet registration and manager configuration | [WDK Core Configuration](https://docs.wdk.tether.io/sdk/core-module/configuration) |
| API Reference | Complete class and type reference | [WDK Core API Reference](https://docs.wdk.tether.io/sdk/core-module/api-reference) |

## Examples

| Example | Description |
|---------|-------------|
| [Getting Started](https://github.com/tetherto/wdk-examples/blob/main/wdk/getting-started.ts) | Generate a seed phrase, validate it, and create a WDK instance |
| [Register Wallets](https://github.com/tetherto/wdk-examples/blob/main/wdk/register-wallets.ts) | Register Solana, TON, and TRON wallet managers in one WDK instance |
| [Manage Accounts](https://github.com/tetherto/wdk-examples/blob/main/wdk/manage-accounts.ts) | Retrieve accounts by index and path and inspect multi-chain balances |
| [Send Transactions](https://github.com/tetherto/wdk-examples/blob/main/wdk/send-transactions.ts) | Quote and optionally send native transactions across multiple chains |
| [Middleware](https://github.com/tetherto/wdk-examples/blob/main/wdk/middleware.ts) | Register middleware and inspect account access hooks |
| [Error Handling](https://github.com/tetherto/wdk-examples/blob/main/wdk/error-handling.ts) | Handle missing registrations and dispose selected wallets safely |

> For detailed walkthroughs, see the [Usage Guide](https://docs.wdk.tether.io/sdk/core-module/usage).
> See all runnable examples in the [wdk-examples](https://github.com/tetherto/wdk-examples) repository.

## Community

Join the [WDK Discord](https://discord.gg/arYXDhHB2w) to connect with other developers.

## Support

For support, please [open an issue](https://github.com/tetherto/wdk/issues) on GitHub or reach out via [email](mailto:wallet-info@tether.io).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
