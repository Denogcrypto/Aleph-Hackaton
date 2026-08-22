# Especificación Técnica: Autonomous Payroll Agents (x402 + Tether WDK)

## 1. Resumen Ejecutivo
**Autonomous Payroll Agents** es un sistema descentralizado y no custodial (*non-custodial*) de agentes autónomos que automatizan el ciclo de vida completo de liquidación de nóminas corporativas en **USD₮**. 

Combina:
- El estándar abierto **x402 (HTTP 402 Payment Required)** para la negociación, solicitud y recibos de cobro estructurados entre agentes.
- **Tether WDK (Wallet Development Kit)** (`@tetherto/wdk`, `@tetherto/wdk-wallet-evm`, `@tetherto/wdk-cli`) como la infraestructura central no custodial para la gestión de billeteras, simulación de transacciones, custodia local de claves y el motor de políticas de seguridad corporativa (**WDK Policy Engine**).

---

## 2. Arquitectura del Sistema

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                             EMPLOYEE AGENT                               │
│  - Detección de hitos / Calendario de nómina                             │
│  - Generación de Requerimientos x402 (HTTP 402)                          │
│  - Billetera WDK del Empleado (Firma de reclamo y recepción de USD₮)     │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                     HTTP Request / x402 Requirement
                     (Headers: X-PAYMENT / Claim Payload)
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              COMPANY AGENT                               │
│  - Registro de Nómina y Validación de Identidades                        │
│  - WDK Policy Engine (Límites ALLOW/DENY, Lista Blanca, Reglas de Gasto) │
│  - Simulación y Liquidación en USD₮ con WDK Core / WDK CLI               │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                        Transferencia USD₮ / On-Chain
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          INFRAESTRUCTURA WDK                             │
│  - @tetherto/wdk: Orquestador central y motor de políticas               │
│  - @tetherto/wdk-wallet-evm: Wallets EVM y transferencias ERC-20         │
│  - @tetherto/wdk-cli: Servidor MCP y ejecución CLI (--json)              │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Componentes Principales

### 3.1. Employee Agent (`src/payroll/employee-agent.js`)
Representa al empleado/contratista en el entorno de agentes:
* **Billetera No Custodial:** Deriva su dirección de cobro de forma determinista usando `@tetherto/wdk-wallet-evm`.
* **Emisión de Solicitud x402:** Al cumplirse el ciclo de pago (ej. día 1 de cada mes), genera un requerimiento estructurado x402 (`create402Requirement`) con los metadatos contractuales.
* **Firma de Intención:** Firma el requerimiento con su clave local y lo adjunta en la cabecera `X-PAYMENT`.
* **Monitoreo de Fondos:** Detecta la recepción de USD₮ y actualiza su estado a `PAID_CONFIRMED`.

### 3.2. Company Agent (`src/payroll/company-agent.js`)
Representa a la tesorería de la organización:
* **Validación de Identidades:** Contrasta la solicitud entrante contra el registro interno de empleados autorizados (`src/payroll/payroll-registry.js`).
* **WDK Policy Engine:** Aplica de forma obligatoria las políticas de seguridad antes de cualquier transferencia:
  1. `deny-unauthorized-recipient`: Bloquea transferencias hacia direcciones que no estén en la lista blanca de empleados activos.
  2. `deny-over-budget`: Bloquea pagos que superen el tope salarial configurado.
  3. `allow-valid-payroll-operations`: Permite únicamente operaciones validadas.
* **Simulación:** Ejecuta `account.simulate.transfer()` para garantizar que la transacción sea válida antes de emitirla a la blockchain.
* **Liquidación y Recibo:** Realiza la transferencia en USD₮ y retorna el recibo oficial con el hash de transacción en la cabecera `X-PAYMENT-RESPONSE`.

---

## 4. Diagrama de Secuencia x402 + WDK

```text
[Employee Agent]                     [Company Agent]                  [Blockchain / USD₮]
       │                                    │                                  │
       │ 1. POST /api/payroll/claim         │                                  │
       │    (Payload x402 + X-PAYMENT)      │                                  │
       ├───────────────────────────────────►│                                  │
       │                                    │ 2. Valida contra registro        │
       │                                    │    (ID, monto, dirección)        │
       │                                    │                                  │
       │                                    │ 3. Evalúa WDK Policy Engine      │
       │                                    │    (account.simulate.transfer)   │
       │                                    │                                  │
       │                                    │ 4. Ejecuta transferencia USD₮    │
       │                                    │    (account.transfer)            │
       │                                    ├─────────────────────────────────►│
       │                                    │                                  │
       │                                    │ 5. Tx Confirmada (txHash)        │
       │                                    │◄─────────────────────────────────┤
       │ 6. 200 OK                          │                                  │
       │    Header X-PAYMENT-RESPONSE: tx   │                                  │
       │◄───────────────────────────────────┤                                  │
       │                                    │                                  │
       │ 7. Actualiza estado a CONFIRMADO   │                                  │
```

---

## 5. Integración con WDK CLI y MCP Server

Para cumplir con los requisitos de la **Pista 1 del Hackatón**, el sistema ofrece compatibilidad total con:
* **Línea de Comandos WDK:** Salidas estructuradas con `npx wdk send --to <addr> --amount <amt> --asset USDT --json` y `npx wdk get --address <addr> --json`.
* **Servidor MCP (`npx wdk mcp`):** Permite a agentes basados en LLMs (Claude, OpenClaw, Gemini) interactuar con las billeteras WDK mediante llamadas a herramientas estructuradas (*Tool Calling*).