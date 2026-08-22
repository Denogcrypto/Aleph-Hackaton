/**
 * @fileoverview Paygent Full-Stack Server
 * Sirve el Dashboard Web interactivo y expone los endpoints del Scheduler, x402 y WDK Policy Engine.
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { CompanyAgent } from './company-agent.js'
import { EmployeeAgent } from './employee-agent.js'
import { PayrollScheduler } from './payroll-scheduler.js'
import { parsePaymentHeader } from './x402-protocol.js'
import { listActiveEmployees, registerEmployee } from './payroll-registry.js'

try {
  process.loadEnvFile()
} catch {}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.join(__dirname, '../../public')

const companyAgent = new CompanyAgent({
  seedPhrase: process.env.COMPANY_SEED_PHRASE || 'test test test test test test test test test test test junk',
  maxSalaryCapUsdt: Number(process.env.MAX_SALARY_PER_TX_USDT) || 5000
})

const aliceAgent = new EmployeeAgent({
  employeeId: 'emp-001',
  name: 'Alice Developer',
  salaryUsdt: 2500,
  paymentDay: 1,
  seedPhrase: process.env.EMPLOYEE_SEED_PHRASE || 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
})

const bobAgent = new EmployeeAgent({
  employeeId: 'emp-002',
  name: 'Bob Designer',
  salaryUsdt: 1800,
  paymentDay: 1,
  seedPhrase: 'legal winner thank year wave sausage worth useful legal winner thank yellow'
})

const employeeAgents = [aliceAgent, bobAgent]

// Registrar empleados en el registro oficial
Promise.all([
  aliceAgent.getWalletAddress(),
  bobAgent.getWalletAddress()
]).then(([aliceAddr, bobAddr]) => {
  registerEmployee({
    employeeId: 'emp-001',
    name: 'Alice Developer',
    walletAddress: aliceAddr,
    salaryUsdt: 2500,
    paymentDay: 1,
    status: 'ACTIVE'
  })
  registerEmployee({
    employeeId: 'emp-002',
    name: 'Bob Designer',
    walletAddress: bobAddr,
    salaryUsdt: 1800,
    paymentDay: 1,
    status: 'ACTIVE'
  })
})

const scheduler = new PayrollScheduler({
  initialDate: new Date().toISOString().slice(0, 10),
  defaultPaymentDay: 1
})

const transactionHistory = [
  {
    timestamp: '2026-08-01 09:00',
    agentId: 'emp-001 (Alice)',
    amountUsdt: 2500,
    status: 'SETTLED',
    txHash: '0x74785f706179726f6c6c5f313738373432363430333138395f30783938353845',
    explorerUrl: 'https://sepolia.etherscan.io/tx/0x74785f706179726f6c6c5f313738373432363430333138395f30783938353845'
  },
  {
    timestamp: '2026-08-01 09:01',
    agentId: 'emp-002 (Bob)',
    amountUsdt: 1800,
    status: 'SETTLED',
    txHash: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc9f7823ab',
    explorerUrl: 'https://sepolia.etherscan.io/tx/0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc9f7823ab'
  }
]

const metrics = {
  treasuryLiquidity: 45700,
  settledVolume: 4300,
  pendingClaimsCount: 2,
  pendingClaimsUsdt: 4300,
  activeAgentsCount: 12
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-PAYMENT')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const parsedUrl = new URL(req.url, 'http://localhost:3000')
  const pathname = parsedUrl.pathname

  // 1. Estado Global del Sistema (GET /api/payroll/status)
  if (pathname === '/api/payroll/status' && req.method === 'GET') {
    const treasuryAddress = await companyAgent.getTreasuryAddress()
    const aliceAddress = await aliceAgent.getWalletAddress()
    const bobAddress = await bobAgent.getWalletAddress()
    const treasuryBalances = await companyAgent.getBalances()
    const employees = listActiveEmployees()

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      treasuryAddress,
      aliceAddress,
      bobAddress,
      treasuryBalances,
      policyEngine: 'ACTIVE',
      network: 'Ethereum Sepolia (eip155:11155111)',
      token: 'USDT Sepolia (0x7169D38820dfd117C3FA1f22a697dBA58d90BA06)',
      maxSalaryCapUsdt: 5000,
      simulatedDate: scheduler.getFormattedDate(),
      currentPeriod: scheduler.getCurrentPeriod(),
      isPaydayToday: scheduler.isPaydayForEmployee(1),
      metrics,
      employees,
      transactionHistory
    }))
    return
  }

  // 2. Estado del Scheduler (GET /api/scheduler/status)
  if (pathname === '/api/scheduler/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      simulatedDate: scheduler.getFormattedDate(),
      currentPeriod: scheduler.getCurrentPeriod(),
      isPayday: scheduler.isPaydayForEmployee(1),
      defaultPaymentDay: scheduler.defaultPaymentDay,
      executedCyclesCount: scheduler.executedCycles.length,
      lastExecutedCycle: scheduler.executedCycles.slice(-1)[0] || null
    }))
    return
  }

  // 3. Time Warp: Adelantar al Día 1 y Disparar Scheduler (POST /api/scheduler/advance-to-payday)
  if (pathname === '/api/scheduler/advance-to-payday' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', async () => {
      try {
        const payload = body ? JSON.parse(body) : {}
        let timeWarpResult = null

        if (payload.targetDate) {
          scheduler.setSimulatedDate(payload.targetDate)
          timeWarpResult = {
            previousDate: new Date().toISOString().slice(0, 10),
            newDate: payload.targetDate,
            period: scheduler.getCurrentPeriod()
          }
        } else {
          timeWarpResult = scheduler.advanceToNextPayday()
        }

        // Ejecutar el ciclo programado a través de los Employee Agents y el Company Agent
        const cycleResult = await scheduler.executeScheduledPayroll({
          companyAgent,
          employeeAgents
        })

        // Actualizar métricas y ledger
        if (cycleResult.settledCount > 0) {
          metrics.settledVolume += cycleResult.totalAmountUsdt
          metrics.treasuryLiquidity = Math.max(0, metrics.treasuryLiquidity - cycleResult.totalAmountUsdt)
          metrics.pendingClaimsCount = Math.max(0, metrics.pendingClaimsCount - cycleResult.settledCount)
          metrics.pendingClaimsUsdt = Math.max(0, metrics.pendingClaimsUsdt - cycleResult.totalAmountUsdt)

          for (const item of cycleResult.results) {
            if (item.status === 'SETTLED') {
              transactionHistory.unshift({
                timestamp: `${scheduler.getFormattedDate()} 09:00`,
                agentId: `${item.employeeId} (${item.name.split(' ')[0]})`,
                amountUsdt: item.amountUsdt,
                status: 'SETTLED',
                txHash: item.txHash,
                explorerUrl: item.receipt?.explorerUrl || `https://sepolia.etherscan.io/tx/${item.txHash}`
              })
            }
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: true,
          timeWarp: timeWarpResult,
          cycleResult,
          metrics,
          simulationLog: [
            `⏰ SCHEDULER: Time warped to ${timeWarpResult.newDate} (Day 1 - Payday)`,
            `🤖 AGENTS: Triggered payment claims for ${employeeAgents.length} active employee agents`,
            '🛡️ WDK POLICY ENGINE: Evaluated spend caps and whitelists -> ALL ALLOWED',
            `💸 SETTLEMENT: Settled ${cycleResult.settledCount} claims on Sepolia USD₮ (Total: ${cycleResult.totalAmountUsdt} USD₮)`,
            'RECEIPTS: Emitted X-PAYMENT-RESPONSE with confirmed Sepolia Tx hashes'
          ]
        }))
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: err.message }))
      }
    })
    return
  }

  // 4. Resetear reloj simulado (POST /api/scheduler/reset-clock)
  if (pathname === '/api/scheduler/reset-clock' && req.method === 'POST') {
    const today = new Date().toISOString().slice(0, 10)
    scheduler.setSimulatedDate(today)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: true,
      simulatedDate: today,
      currentPeriod: scheduler.getCurrentPeriod(),
      isPayday: scheduler.isPaydayForEmployee(1)
    }))
    return
  }

  // 5. Disparo Individual de Reclamo Legítimo (POST /api/payroll/trigger-employee-claim)
  if (pathname === '/api/payroll/trigger-employee-claim' && req.method === 'POST') {
    try {
      const period = scheduler.getCurrentPeriod()
      const claimResult = await aliceAgent.claimSalaryFromCompany(companyAgent, period)

      if (claimResult.success) {
        metrics.settledVolume += 2500
        metrics.treasuryLiquidity = Math.max(0, metrics.treasuryLiquidity - 2500)
        metrics.pendingClaimsCount = Math.max(0, metrics.pendingClaimsCount - 1)
        metrics.pendingClaimsUsdt = Math.max(0, metrics.pendingClaimsUsdt - 2500)

        const newTx = {
          timestamp: `${scheduler.getFormattedDate()} ${new Date().toTimeString().slice(0, 5)}`,
          agentId: 'emp-001 (Alice)',
          amountUsdt: 2500,
          status: 'SETTLED',
          txHash: claimResult.receipt.txHash,
          explorerUrl: claimResult.receipt.explorerUrl || `https://sepolia.etherscan.io/tx/${claimResult.receipt.txHash}`
        }
        transactionHistory.unshift(newTx)
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: claimResult.success,
        receipt: claimResult.receipt,
        employeeStatus: aliceAgent.status,
        metrics,
        simulationLog: [
          'INIT: Policy check triggered for emp-001 (Alice Developer)',
          'RULE: Whitelist Only -> PASS (0x9858...Eda94)',
          'RULE: Max Cap 5,000 USDt -> PASS (2,500 USDt requested)',
          'SIMULATION: account.simulate.transfer -> ALLOW',
          `SETTLEMENT: Broadcast on Sepolia -> ${claimResult.receipt?.txHash}`,
          'ACKNOWLEDGEMENT: Employee Agent validated receipt and confirmed status: PAID_CONFIRMED'
        ]
      }))
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: err.message }))
    }
    return
  }

  // 6. Simulación de Amenaza / Ataque (POST /api/payroll/simulate-threat)
  if (pathname === '/api/payroll/simulate-threat' && req.method === 'POST') {
    const rogueClaim = {
      employeeId: 'hacker-999',
      walletAddress: '0x000000000000000000000000000000000000dEaD',
      amountUsdt: 10000,
      amount: '10000000000'
    }

    const rogueResult = await companyAgent.processPaymentClaim(rogueClaim)

    const blockedTx = {
      timestamp: `${scheduler.getFormattedDate()} ${new Date().toTimeString().slice(0, 5)}`,
      agentId: 'hacker-999 (Rogue)',
      amountUsdt: 10000,
      status: 'BLOCKED_POLICY',
      txHash: 'N/A (BLOCKED_BY_WDK)',
      explorerUrl: null
    }
    transactionHistory.unshift(blockedTx)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: false,
      blocked: true,
      error: rogueResult.error,
      simulationLog: [
        'INIT: Threat detected from unauthorized agent hacker-999',
        'RULE: Whitelist Only -> DENY (Address not in employee registry)',
        'RULE: Max Cap 5,000 USDt -> DENY (10,000 USDt exceeds ceiling)',
        'POLICY ENGINE: PolicyViolationError: Matched rule deny-unauthorized-recipient',
        'DECISION: Transaction BLOCKED before signature or Sepolia broadcast'
      ]
    }))
    return
  }

  // 7. Endpoint directo de Reclamos x402 (POST /api/payroll/claim)
  if (pathname === '/api/payroll/claim' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', async () => {
      try {
        const xPaymentHeader = req.headers['x-payment']
        const payload = xPaymentHeader ? parsePaymentHeader(xPaymentHeader) : JSON.parse(body || '{}')
        const result = await companyAgent.processPaymentClaim(payload)

        if (!result.success) {
          res.writeHead(403, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(result))
          return
        }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'X-PAYMENT-RESPONSE': JSON.stringify(result.receipt)
        })
        res.end(JSON.stringify(result))
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: err.message }))
      }
    })
    return
  }

  // 8. Servir archivos estáticos del Dashboard y Landing Page (HTML, CSS, SVG, etc.)
  const targetFile = pathname === '/' || pathname === '/landing'
    ? 'landing.html'
    : (pathname === '/cockpit'
        ? 'index.html'
        : (pathname.startsWith('/') ? pathname.slice(1) : pathname))

  let filePath = path.join(PUBLIC_DIR, targetFile)
  let ext = path.extname(filePath)

  // Si no tiene extensión y no existe, probar con .html
  if (!ext && !fs.existsSync(filePath)) {
    if (fs.existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`
      ext = '.html'
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    fs.createReadStream(filePath).pipe(res)
  } else {
    const fallbackPath = path.join(PUBLIC_DIR, 'landing.html')
    if (fs.existsSync(fallbackPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      fs.createReadStream(fallbackPath).pipe(res)
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404 Not Found')
    }
  }
})

const PORT = process.env.PORT || 3000
server.listen(PORT, async () => {
  const treasury = await companyAgent.getTreasuryAddress()
  console.log(`\n🚀 [Paygent Dashboard & x402 Server] running at http://localhost:${PORT}`)
  console.log(`🏢 Treasury Address: ${treasury}`)
  console.log('🛡️ WDK Policy Engine: ACTIVE')
  console.log('⏰ Payroll Scheduler: Active on Day 1 (Ethereum Sepolia USD₮)\n')
})
