/**
 * @fileoverview Autonomous Payroll Agents - Interactive End-to-End Demo (x402 + Tether WDK)
 * Demostración interactiva para el Hackatón de Aleph (Pista WDK - Ethereum Sepolia USD₮).
 */

import { CompanyAgent } from './src/payroll/company-agent.js'
import { EmployeeAgent } from './src/payroll/employee-agent.js'
import { PayrollScheduler } from './src/payroll/payroll-scheduler.js'
import { registerEmployee } from './src/payroll/payroll-registry.js'

try {
  process.loadEnvFile()
} catch {}

function printHeader (title) {
  console.log('\n' + '═'.repeat(75))
  console.log(`  🔹 ${title}`)
  console.log('═'.repeat(75))
}

function printStep (number, title) {
  console.log(`\n📌 [PASO ${number}] ${title}`)
  console.log('─'.repeat(60))
}

async function runDemo () {
  console.log(`
  ╔═══════════════════════════════════════════════════════════════════════════╗
  ║                 PAYGENT: AUTONOMOUS PAYROLL AGENTS                        ║
  ║         Scheduler (Day 1) + x402 Protocol + Tether WDK Core & CLI         ║
  ║                   Network: Ethereum Sepolia (USD₮)                        ║
  ╚═══════════════════════════════════════════════════════════════════════════╝
  `)

  // =========================================================================
  // PASO 1: Inicialización de Agentes y Billeteras WDK
  // =========================================================================
  printStep(1, 'Inicialización de Agentes y Billeteras No Custodiales (WDK)')

  const companyAgent = new CompanyAgent({
    seedPhrase: 'test test test test test test test test test test test junk',
    maxSalaryCapUsdt: 5000
  })

  const treasuryAddress = await companyAgent.getTreasuryAddress()
  console.log(`🏢 [Company Agent] Billetera de Tesorería WDK: ${treasuryAddress}`)
  console.log(`🛡️ [Company Agent] WDK Policy Engine activo: DEFAULT-DENY + Tope 5,000 USD₮ + Whitelist.`)

  const aliceAgent = new EmployeeAgent({
    employeeId: 'emp-001',
    name: 'Alice Developer',
    salaryUsdt: 2500,
    paymentDay: 1,
    seedPhrase: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
  })

  const aliceAddress = await aliceAgent.getWalletAddress()
  console.log(`🤖 [Employee Agent] Alice Developer WDK Wallet: ${aliceAddress}`)

  // Registrar a Alice en el registro oficial de nómina
  registerEmployee({
    employeeId: 'emp-001',
    name: 'Alice Developer',
    walletAddress: aliceAddress,
    salaryUsdt: 2500,
    paymentDay: 1,
    status: 'ACTIVE'
  })

  // =========================================================================
  // PASO 2: Simulación Temporal del Scheduler (Time Warp al Día 1)
  // =========================================================================
  printStep(2, 'Simulación Temporal del Scheduler: Adelantar el reloj al Día 1 (Payday)')

  const scheduler = new PayrollScheduler({
    initialDate: '2026-08-22',
    defaultPaymentDay: 1
  })

  console.log(`📅 Fecha inicial del sistema: ${scheduler.getFormattedDate()} (Hoy no es día de pago)`)
  console.log(`   ¿Es día de cobro para Alice? ${scheduler.isPaydayForEmployee(1) ? 'SÍ' : 'NO (Esperando ciclo)'}`)

  const timeWarp = scheduler.advanceToNextPayday()
  console.log(`⚡ [Time Warp] Reloj adelantado exitosamente a: ${timeWarp.newDate} (Período: ${timeWarp.period})`)
  console.log(`   ¿Es día de cobro para Alice ahora? ${scheduler.isPaydayForEmployee(1) ? '✅ SÍ (Día 1 detectado - Scheduler despierta a los agentes)' : 'NO'}`)

  // =========================================================================
  // PASO 3: Prueba de Seguridad del WDK Policy Engine (Ataque / Cobro Inválido)
  // =========================================================================
  printStep(3, 'Prueba de Seguridad: Bloqueo de Reclamos Inválidos (WDK Policy Engine)')

  console.log('🧪 Intento 1: Un atacante no registrado intenta cobrar 2,000 USD₮...')
  const rogueClaim = {
    employeeId: 'hacker-999',
    walletAddress: '0x000000000000000000000000000000000000dEaD',
    amountUsdt: 2000
  }
  const rogueResult = await companyAgent.processPaymentClaim(rogueClaim)
  console.log(`   Resultado: ${rogueResult.success ? 'APROBADO' : '🛑 RECHAZADO'}`)
  console.log(`   Motivo: ${rogueResult.error}`)

  console.log('\n🧪 Intento 2: Solicitud que excede el tope de política (7,500 USD₮ > 5,000 USD₮ cap)...')
  const excessiveClaim = {
    employeeId: 'emp-001',
    walletAddress: aliceAddress,
    amountUsdt: 7500,
    amount: '7500000000'
  }
  const excessiveResult = await companyAgent.processPaymentClaim(excessiveClaim)
  console.log(`   Resultado: ${excessiveResult.success ? 'APROBADO' : '🛑 RECHAZADO'}`)
  console.log(`   Motivo: ${excessiveResult.error}`)

  // =========================================================================
  // PASO 4: Emisión de Requerimiento de Nómina x402 Legítimo
  // =========================================================================
  printStep(4, 'Emisión de Requerimiento de Nómina x402 por el Employee Agent')

  const x402Requirement = await aliceAgent.generatePayrollRequirement(timeWarp.period)
  console.log('📄 [x402 Requirement Payload]:')
  console.log(JSON.stringify(x402Requirement, null, 2))

  // =========================================================================
  // PASO 5: Simulación Pre-Flight, Liquidación y Emisión de Recibo en Sepolia USD₮
  // =========================================================================
  printStep(5, 'Validación, Simulación Pre-Flight y Liquidación en USD₮ con WDK')

  const claimResult = await aliceAgent.claimSalaryFromCompany(companyAgent, timeWarp.period)

  if (claimResult.success) {
    console.log('\n📜 [Recibo Oficial X-PAYMENT-RESPONSE]:')
    console.log(JSON.stringify(claimResult.receipt, null, 2))
    console.log(`🔗 Verificación en Explorer: ${claimResult.receipt.explorerUrl}`)
    console.log(`🎉 Estado final del Employee Agent: ${aliceAgent.status} (Recibo verificado y reconocido)`)
  } else {
    console.error('❌ Error inesperado en la liquidación.')
  }

  // =========================================================================
  // Resumen de Arquitectura para el Jurado
  // =========================================================================
  printHeader('RESUMEN DE INTEGRACIÓN WDK PARA EL JURADO')
  console.log(`
  ✅ Cadena y Activo Exclusivos:
     - Red: Ethereum Sepolia Testnet (Chain ID: 11155111 / eip155:11155111)
     - Token: USD₮ Sepolia (0x7169D38820dfd117C3FA1f22a697dBA58d90BA06)

  ✅ Paquetes WDK Utilizados:
     - @tetherto/wdk (Orquestador no custodial y Policy Engine de gobernanza)
     - @tetherto/wdk-wallet-evm (Derivación BIP-39 y transferencias EVM)
     - @tetherto/wdk-cli (Comandos de línea e integración WDK MCP)

  ✅ Componentes Clave:
     - Scheduler Día 1 con Time Warp: src/payroll/payroll-scheduler.js
     - Protocolo RFC x402 (HTTP 402, X-PAYMENT, X-PAYMENT-RESPONSE): src/payroll/x402-protocol.js
     - Servicio Central WDK & Policy Engine: src/payroll/wdk-payroll-service.js
     - Agentes Autónomos: src/payroll/company-agent.js & src/payroll/employee-agent.js
     - Dashboard Web Full-Stack: public/index.html & src/payroll/server.js
  `)

  aliceAgent.dispose()
  companyAgent.stop()
}

runDemo().catch(console.error)
