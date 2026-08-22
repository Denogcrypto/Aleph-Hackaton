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