# 🟧 Autonomous Payroll Agents (x402 + Tether WDK)

[![WDK Core](https://img.shields.io/badge/@tetherto/wdk-1.0.0--beta.16-blue.svg)](https://www.npmjs.com/package/@tetherto/wdk)
[![WDK CLI](https://img.shields.io/badge/@tetherto/wdk--cli-1.0.0--beta.3-green.svg)](https://www.npmjs.com/package/@tetherto/wdk-cli)
[![WDK Wallet EVM](https://img.shields.io/badge/@tetherto/wdk--wallet--evm-1.0.0--beta.17-orange.svg)](https://www.npmjs.com/package/@tetherto/wdk-wallet-evm)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

Un sistema descentralizado y no custodial de agentes autónomos que automatiza el proceso de negociación, validación, liquidación y recibos de nóminas corporativas en **USD₮**, utilizando el protocolo **x402 (HTTP 402 Payment Required)** y el **Wallet Development Kit (WDK) de Tether** junto con su interfaz **WDK CLI / MCP Server**.

---

## 🎯 Resumen del Proyecto

Actualmente, el pago de nóminas en las empresas requiere intervención humana constante para verificar fechas, calcular salarios, emitir órdenes de pago y confirmar transferencias.

**Autonomous Payroll Agents** convierte el pago de salarios en una interacción económica directa entre agentes autónomos:
- 🤖 **Employee Agent:** Representa al empleado, detecta las fechas de cobro o hitos de entrega, emite requerimientos estructurados bajo el protocolo **x402** y monitorea la acreditación en su billetera.
- 🏢 **Company Agent:** Representa a la tesorería corporativa, valida la identidad y salario contra los registros de nómina, evalúa las políticas de seguridad en el **WDK Policy Engine** y ejecuta la liquidación en **USD₮** de forma no custodial.

---

## 🏗️ Arquitectura

```text
                                  x402 Protocol
┌──────────────────────┐   HTTP 402 / X-PAYMENT   ┌──────────────────────┐
│    Employee Agent    │ ───────────────────────► │    Company Agent     │
│                      │                          │                      │
│ - Scheduler de cobro │ ◄─────────────────────── │ - Payroll Registry   │
│ - x402 Claim Creator │    X-PAYMENT-RESPONSE    │ - WDK Policy Engine  │
│ - WDK Balance Watch  │                          │ - WDK Execution      │
└──────────┬───────────┘                          └──────────┬───────────┘
           │                                                 │
           ▼                                                 ▼
    Employee Wallet                                    Company Wallet
           ▲                                                 │
           └────────────────── USDT Transfer ────────────────┘
                              (On-Chain / WDK)
```

---

## 🔗 Enlaces Directos a la Integración de WDK (Permalinks para el Jurado)

La integración con WDK es limpia, modular y central en la arquitectura del sistema:

1. **Instanciación y Registro de Billeteras WDK Core:**
   - [`src/payroll/wdk-payroll-service.js#L34-L39`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) — Inicialización de `new WDK(seedPhrase)` y registro del módulo `WalletManagerEvm`.
2. **WDK Policy Engine (Reglas de Seguridad y Límites):**
   - [`src/payroll/wdk-payroll-service.js#L46-L92`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) — Registro de reglas `ALLOW`/`DENY` para restringir transferencias a la lista blanca de empleados y topar los montos máximos por nómina.
3. **Simulación Previa con WDK (`account.simulate.transfer`):**
   - [`src/payroll/wdk-payroll-service.js#L114-L123`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) y [`src/payroll/company-agent.js#L73-L84`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/company-agent.js) — Evaluación no intrusiva de políticas antes de emitir transacciones a la red.
4. **Liquidación y Transferencia de USD₮ (`account.transfer`):**
   - [`src/payroll/wdk-payroll-service.js#L131-L140`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) — Ejecución no custodial de la transferencia de USD₮.
5. **Derivación de Cuentas del Empleado:**
   - [`src/payroll/employee-agent.js#L39-L43`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/employee-agent.js) — Derivación de la clave pública del empleado con WDK.
6. **Ejecución vía WDK CLI (`wdk send --json`):**
   - [`src/payroll/wdk-payroll-service.js#L147-L163`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) — Integración por línea de comandos y salida estructurada JSON.

---

## 📦 Paquetes WDK Utilizados

| Paquete | Versión Instalada | Propósito |
| :--- | :---: | :--- |
| **`@tetherto/wdk`** | `1.0.0-beta.16` | Orquestador central, gestión no custodial de claves y Policy Engine. |
| **`@tetherto/wdk-cli`** | `1.0.0-beta.3` | Interfaz de línea de comandos (`wdk send --json`, `wdk get`) y servidor MCP (`wdk mcp`). |
| **`@tetherto/wdk-wallet-evm`** | `1.0.0-beta.17` | Módulo de billeteras EVM, derivación BIP-44 y transferencias ERC-20. |
| **`@tetherto/wdk-wallet`** | `1.0.0-beta.15` | Interfaces base (`IWalletAccount`, `WalletManager`). |

---

## ⚙️ Instrucciones de Configuración y Ejecución (Clean Clone)

### 1. Requisitos Previos
- **Node.js**: $\ge$ 22.18.0 (probado en Node.js v24.19.0)
- **npm**: $\ge$ 10.0.0

### 2. Instalación
Clona el repositorio e instala las dependencias:
```bash
git clone https://github.com/Denogcrypto/Aleph-Hackaton.git
cd Aleph-Hackaton
npm install
```

### 3. Variables de Entorno
Copia el archivo de ejemplo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Variables configuradas por defecto:
- `RPC_URL`: `https://ethereum-sepolia-rpc.publicnode.com` (Sepolia Testnet)
- `CHAIN_ID`: `11155111`
- `USDT_TOKEN_ADDRESS`: `0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0` (USD₮ Sepolia)
- `COMPANY_SEED_PHRASE`: Frase semilla BIP-39 de prueba de la empresa.
- `EMPLOYEE_SEED_PHRASE`: Frase semilla BIP-39 de prueba del empleado.

---

## 🚀 Ejecución de la Demostración

Ejecuta la demo interactiva completa de extremo a extremo:
```bash
npm run demo
```

### Flujo de la Demo:
1. **Inicialización:** Deriva las direcciones públicas de la tesorería y de los empleados usando WDK.
2. **Prueba de Seguridad (WDK Policy Engine):** Intenta realizar cobros con atacantes no autorizados y montos superiores al tope salarial, demostrando el bloqueo automático (`PolicyViolationError`).
3. **Generación x402:** El Employee Agent genera un requerimiento estándar HTTP 402.
4. **Validación y Liquidación:** El Company Agent simula con `account.simulate.transfer` y ejecuta el pago de USD₮.
5. **Recibo Oficial:** Se genera el recibo `X-PAYMENT-RESPONSE` con el hash de transacción y confirmación de nómina.

---

## 🧪 Pruebas Automatizadas

Ejecuta la suite de pruebas unitarias y de integración:
```bash
npm test
```

Incluye 172 tests pasando exitosamente (100% de cobertura en core de WDK, Policy Engine y agentes de nómina x402).

---

## 📄 Licencia

Este proyecto está bajo la licencia [Apache-2.0](LICENSE).
