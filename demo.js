/**
 * @fileoverview Autonomous Payroll Agents - Interactive End-to-End Demo (x402 + Tether WDK)
 * Demostración interactiva para el Hackatón de Aleph (Pista WDK).
 */

import { CompanyAgent } from './src/payroll/company-agent.js'
import { EmployeeAgent } from './src/payroll/employee-agent.js'
import { registerEmployee } from './src/payroll/payroll-registry.js'

function printHeader (title) {
  console.log('\n' + '═'.repeat(70))
  console.log(`  🔹 ${title}`)
  console.log('═'.repeat(70))
}

function printStep (number, title) {
  console.log(`\n📌 [PASO ${number}] ${title}`)
  console.log('─'.repeat(50))
}

async function runDemo () {
  console.log(`
  ╔════════════════════════════════════════════════════════════════════╗
  ║                 AUTONOMOUS PAYROLL AGENTS                          ║
  ║             x402 Protocol + Tether WDK Core & CLI                  ║
  ║                   Aleph Hackathon 2026                             ║
  ╚════════════════════════════════════════════════════════════════════╝
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
  console.log(`🛡️ [Company Agent] WDK Policy Engine activo con tope de 5,000 USD₮ y Lista Blanca.`)

  const aliceAgent = new EmployeeAgent({
    employeeId: 'emp-001',
    name: 'Alice Developer',
    salaryUsdt: 2500,
    seedPhrase: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
  })

  const aliceAddress = await aliceAgent.getWalletAddress()
  console.log(`🤖 [Employee Agent] Alice Developer WDK Wallet: ${aliceAddress}`)

  // Asegurar registro de Alice con su dirección derivada
  registerEmployee({
    employeeId: 'emp-001',
    name: 'Alice Developer',
    walletAddress: aliceAddress,
    salaryUsdt: 2500,
    paymentDay: 1,
    status: 'ACTIVE'
  })

  // =========================================================================
  // PASO 2: Prueba de Seguridad del WDK Policy Engine (Ataque / Cobro Inválido)
  // =========================================================================
  printStep(2, 'Prueba de Seguridad: Bloqueo de Reclamos Inválidos (WDK Policy Engine)')

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
  // PASO 3: Emisión de Requerimiento de Nómina x402 Legítimo
  // =========================================================================
  printStep(3, 'Emisión de Requerimiento de Nómina x402 por el Employee Agent')

  const x402Requirement = await aliceAgent.generatePayrollRequirement('2026-09')
  console.log('📄 [x402 Payload Generado]:')
  console.log(JSON.stringify(x402Requirement, null, 2))

  // =========================================================================
  // PASO 4: Procesamiento, Simulación y Liquidación con WDK
  // =========================================================================
  printStep(4, 'Validación, Simulación y Liquidación en USD₮ con WDK')

  const claimResult = await aliceAgent.claimSalaryFromCompany(companyAgent, '2026-09')

  // =========================================================================
  // PASO 5: Confirmación y Recibo Formal x402
  // =========================================================================
  printStep(5, 'Confirmación de Nómina y Recibo de Liquidación x402')

  if (claimResult.success) {
    console.log('📜 [Recibo Oficial X-PAYMENT-RESPONSE]:')
    console.log(JSON.stringify(claimResult.receipt, null, 2))
    console.log(`\n🎉 Estado final del Employee Agent: ${aliceAgent.status}`)
  } else {
    console.error('❌ Error inesperado en la liquidación.')
  }

  // =========================================================================
  // Resumen para el Jurado
  // =========================================================================
  printHeader('RESUMEN DE INTEGRACIÓN WDK PARA EL JURADO')
  console.log(`
  ✅ Paquetes WDK Utilizados:
     - @tetherto/wdk (Orquestador y Policy Engine)
     - @tetherto/wdk-wallet-evm (Derivación y transferencias EVM)
     - @tetherto/wdk-cli (Comandos CLI y servidor wdk-mcp)

  ✅ Puntos de Integración WDK:
     - Instanciación & Derivación: src/payroll/wdk-payroll-service.js (línea ~27)
     - WDK Policy Engine (ALLOW/DENY): src/payroll/wdk-payroll-service.js (línea ~43)
     - Simulación (account.simulate.transfer): src/payroll/company-agent.js (línea ~55)
     - Transferencia de Fondos: src/payroll/wdk-payroll-service.js (línea ~120)

  ✅ Protocolo de Pago:
     - HTTP 402 / X-PAYMENT / X-PAYMENT-RESPONSE implementado en src/payroll/x402-protocol.js
  `)

  aliceAgent.dispose()
  companyAgent.stop()
}

runDemo().catch(console.error)
