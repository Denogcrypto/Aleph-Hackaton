# 🟧 Paygent: Autonomous Payroll Agents (x402 + Tether WDK)

[![WDK Core](https://img.shields.io/badge/@tetherto/wdk-1.0.0--beta.16-blue.svg)](https://www.npmjs.com/package/@tetherto/wdk)
[![WDK CLI](https://img.shields.io/badge/@tetherto/wdk--cli-1.0.0--beta.3-green.svg)](https://www.npmjs.com/package/@tetherto/wdk-cli)
[![WDK Wallet EVM](https://img.shields.io/badge/@tetherto/wdk--wallet--evm-1.0.0--beta.17-orange.svg)](https://www.npmjs.com/package/@tetherto/wdk-wallet-evm)
[![Tests](https://img.shields.io/badge/tests-174%20passed-brightgreen.svg)](tests/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

**Paygent** es una infraestructura descentralizada y no custodial de agentes autónomos de IA que automatiza la negociación, validación, liquidación y recibos de nóminas corporativas en **USD₮**, utilizando el protocolo **x402 (HTTP 402 Payment Required)**, el **Tether Wallet Development Kit (WDK)** y su interfaz **WDK CLI / MCP Server**.

---

## 🎯 Resumen del Proyecto y Propuesta de Valor

En la naciente **Economía Agéntica**, los agentes autónomos de IA trabajan para empresas y entre sí, pero no pueden abrir cuentas bancarias tradicionales ni pasar procesos de KYC humano presencial.

**Paygent** resuelve este cuello de botella con una arquitectura financiera nativa para máquinas:
- 🤖 **Employee Agent:** Representa al agente trabajador/especialista, detecta las fechas de cobro pactadas (Scheduler Día 1), emite requerimientos estructurados bajo el protocolo **RFC x402** (`HTTP 402 + X-PAYMENT`) y valida criptográficamente la acreditación de USD₮ en su billetera.
- 🏢 **Company Agent:** Representa a la tesorería corporativa, valida la identidad contra el registro oficial, evalúa las políticas de seguridad en el **Tether WDK Policy Engine** (Default-Deny, lista blanca y topes de gasto) y ejecuta la transferencia en **USD₮** de forma 100% no custodial.
- ⚡ **Payroll Scheduler & Time Warp:** Un motor temporal que ejecuta los ciclos el Día 1 de cada mes y permite demostraciones aceleradas en vivo para el jurado.

---

## 🏗️ Arquitectura del Sistema

```text
                                   x402 Protocol
┌──────────────────────┐   HTTP 402 / X-PAYMENT   ┌──────────────────────┐
│    Employee Agent    │ ───────────────────────► │    Company Agent     │
│                      │                          │                      │
│ - Scheduler Día 1    │ ◄─────────────────────── │ - Payroll Registry   │
│ - x402 Claim Creator │    X-PAYMENT-RESPONSE    │ - WDK Policy Engine  │
│ - Receipt Validator  │    (Tx Hash Sepolia)     │ - WDK Simulate & Send│
└──────────┬───────────┘                          └──────────┬───────────┘
           │                                                 │
           ▼                                                 ▼
    Employee Wallet                                    Company Wallet
(0x9858Ef...Eda94)                                (0xf39Fd6...2266)
           ▲                                                 │
           └─────────────── USD₮ Sepolia Transfer ───────────┘
                            (ERC-20 On-Chain)
```

---

## 🔗 Permalinks de Integración Tether WDK para el Jurado

La integración con WDK es central, limpia y sigue las especificaciones oficiales:

1. **Instanciación y Registro de Billeteras WDK Core:**
   - [`src/payroll/wdk-payroll-service.js`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) — Inicialización de `new WDK(seedPhrase)` y registro del módulo `WalletManagerEvm` con provider RPC de Sepolia.
2. **WDK Policy Engine (Reglas de Seguridad y Límites):**
   - [`src/payroll/wdk-payroll-service.js`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) — Registro de reglas `ALLOW`/`DENY` para restringir transferencias a la lista blanca de empleados y topar los montos máximos por nómina (Default-Deny).
3. **Simulación Previa con WDK (`account.simulate.transfer`):**
   - [`src/payroll/wdk-payroll-service.js`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) y [`src/payroll/company-agent.js`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/company-agent.js) — Evaluación no intrusiva de políticas antes de emitir transacciones a la red.
4. **Liquidación y Transferencia de USD₮ (`account.transfer`):**
   - [`src/payroll/wdk-payroll-service.js`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) — Ejecución no custodial de la transferencia de USD₮ en Sepolia.
5. **Derivación de Cuentas y Consulta de Balances On-Chain:**
   - [`src/payroll/employee-agent.js`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/employee-agent.js) y [`src/payroll/company-agent.js`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/company-agent.js) — Derivación de claves públicas y lectura de balances reales en Sepolia (`account.getBalance()`, `account.getTokenBalance()`).
6. **Ejecución vía WDK CLI / MCP (`wdk send --json`):**
   - [`src/payroll/wdk-payroll-service.js`](file:///Users/gabo/Desktop/Proyectos/aleph/src/payroll/wdk-payroll-service.js) — Integración por línea de comandos y salida estructurada JSON.

---

## 📦 Paquetes WDK Utilizados

| Paquete | Versión Instalada | Propósito |
| :--- | :---: | :--- |
| **`@tetherto/wdk`** | `1.0.0-beta.16` | Orquestador central, gestión no custodial de claves y Policy Engine. |
| **`@tetherto/wdk-cli`** | `1.0.0-beta.3` | Interfaz de línea de comandos (`wdk send --json`, `wdk get`) y servidor MCP (`wdk mcp`). |
| **`@tetherto/wdk-wallet-evm`** | `1.0.0-beta.17` | Módulo de billeteras EVM, derivación BIP-44 y transferencias ERC-20 en Sepolia. |
| **`@tetherto/wdk-wallet`** | `1.0.0-beta.15` | Interfaces base (`IWalletAccount`, `WalletManager`). |

---

## 🌐 Wallets y Contrato en Ethereum Sepolia Testnet

- **Tesorería de la Empresa (Payer):** [`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`](https://sepolia.etherscan.io/address/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
- **Alice Developer (Senior Core Dev):** [`0x9858EfFD232B4033E47d90003D41EC34EcaEda94`](https://sepolia.etherscan.io/address/0x9858EfFD232B4033E47d90003D41EC34EcaEda94)
- **Bob Designer (UI/UX Lead):** [`0x58A57ed9d8d624cBD12e2C467D34787555bB1b25`](https://sepolia.etherscan.io/address/0x58A57ed9d8d624cBD12e2C467D34787555bB1b25)
- **Contrato Oficial USD₮ en Sepolia:** [`0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`](https://sepolia.etherscan.io/address/0x7169D38820dfd117C3FA1f22a697dBA58d90BA06) (6 decimales)

---

## 🖥️ Interfaz Web, Landing Page y Experiencia de Usuario

1. **Landing Page One-Page Oficial (`/` o `/landing.html`):**
   - Diseñada en **Google Stitch** con tema *Technical Premium*.
   - Fondo con **Shader WebGL interactivo** de haces de energía y partículas USD₮.
   - Visual dual de agentes holográficos interconectados por un haz cinético láser.
   - **Sandbox interactivo en vivo** para que el jurado pruebe el WDK Policy Engine con 1 clic.
2. **Dashboard / Cockpit Operativo (`/cockpit` o `/index.html`):**
   - Control de Time Warp Scheduler (Adelanto de reloj al Día 1).
   - Métricas KPI en tiempo real (Liquidez de tesorería, volumen liquidado, reclamos pendientes).
   - Estación de reclamos de empleados y simulador de ataques.
   - Inspector de protocolo en 5 fases y libro contable inmutable de auditoría x402.
3. **Bilingüe e Internacionalización (`i18n`):**
   - **Español (ES)** como idioma principal y predeterminado.
   - **Inglés (EN)** secundario con conmutación en 1 clic.
4. **Temas Dark / Light Mode (`☀️ / 🌙`):**
   - Modo Oscuro por defecto y Modo Claro *Swiss Clean* de alto contraste.

---

## ⚙️ Instrucciones de Configuración y Ejecución (Clean Clone)

### 1. Requisitos Previos
- **Node.js**: $\ge$ 22.18.0 (probado en Node.js v24.19.0)
- **npm**: $\ge$ 10.0.0

### 2. Instalación
```bash
git clone https://github.com/Denogcrypto/Aleph-Hackaton.git
cd Aleph-Hackaton
npm install
```

### 3. Iniciar Servidor y Dashboard Web
```bash
npm run dev
```
Abre en tu navegador:
- **Landing Page:** [http://localhost:3000/](http://localhost:3000/)
- **Cockpit Operativo:** [http://localhost:3000/cockpit](http://localhost:3000/cockpit)

### 4. Ejecución de la Demo por Consola
```bash
npm run demo
```

### 5. Pruebas Automatizadas
```bash
npm test
```
Ejecuta los **174 tests automatizados** cubriendo el core de WDK, el Policy Engine y los agentes de nómina x402.

### 6. Calidad de Código y Tipos TypeScript
```bash
npm run lint
npm run build:types
```

---

## 📄 Licencia

Este proyecto está bajo la licencia [Apache-2.0](LICENSE).
