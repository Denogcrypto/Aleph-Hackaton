/**
 * @fileoverview Paygent Full-Stack Server
 * Sirve el Dashboard Web interactivo y expone los endpoints x402 y de gestión para los agentes.
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { CompanyAgent } from './company-agent.js'
import { EmployeeAgent } from './employee-agent.js'
import { parsePaymentHeader } from './x402-protocol.js'
import { listActiveEmployees, registerEmployee } from './payroll-registry.js'

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
  seedPhrase: process.env.EMPLOYEE_SEED_PHRASE || 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
})

// Registro inicial de Alice
aliceAgent.getWalletAddress().then(address => {
  registerEmployee({
    employeeId: 'emp-001',
    name: 'Alice Developer',
    walletAddress: address,
    salaryUsdt: 2500,
    paymentDay: 1,
    status: 'ACTIVE'
  })
})

const transactionHistory = [
  {
    timestamp: '2026-08-22 14:10',
    agentId: 'emp-002 (Bob)',
    amountUsdt: 1800,
    status: 'SETTLED',
    txHash: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc9f78...'
  }
]

let metrics = {
  treasuryLiquidity: 50000,
  settledVolume: 22500,
  pendingClaimsCount: 3,
  pendingClaimsUsdt: 7500,
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

  // 1. Endpoint de Estado del Sistema (GET /api/payroll/status)
  if (req.url === '/api/payroll/status' && req.method === 'GET') {
    const treasuryAddress = await companyAgent.getTreasuryAddress()
    const aliceAddress = await aliceAgent.getWalletAddress()
    const employees = listActiveEmployees()

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      treasuryAddress,
      aliceAddress,
      policyEngine: 'ACTIVE',
      maxSalaryCapUsdt: 5000,
      metrics,
      employees,
      transactionHistory
    }))
    return
  }

  // 2. Disparo de Reclamo Legítimo por Employee Agent (POST /api/payroll/trigger-employee-claim)
  if (req.url === '/api/payroll/trigger-employee-claim' && req.method === 'POST') {
    try {
      const claimResult = await aliceAgent.claimSalaryFromCompany(companyAgent, '2026-09')

      if (claimResult.success) {
        metrics.settledVolume += 2500
        metrics.treasuryLiquidity -= 2500
        metrics.pendingClaimsCount = Math.max(0, metrics.pendingClaimsCount - 1)
        metrics.pendingClaimsUsdt = Math.max(0, metrics.pendingClaimsUsdt - 2500)

        const newTx = {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          agentId: 'emp-001 (Alice)',
          amountUsdt: 2500,
          status: 'SETTLED',
          txHash: claimResult.receipt.txHash
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
          `SETTLEMENT: Broadcast on-chain -> ${claimResult.receipt?.txHash}`
        ]
      }))
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: err.message }))
    }
    return
  }

  // 3. Simulación de Amenaza / Ataque al Policy Engine (POST /api/payroll/simulate-threat)
  if (req.url === '/api/payroll/simulate-threat' && req.method === 'POST') {
    const rogueClaim = {
      employeeId: 'hacker-999',
      walletAddress: '0x000000000000000000000000000000000000dEaD',
      amountUsdt: 10000,
      amount: '10000000000'
    }

    const rogueResult = await companyAgent.processPaymentClaim(rogueClaim)

    const blockedTx = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      agentId: 'hacker-999 (Rogue)',
      amountUsdt: 10000,
      status: 'BLOCKED_POLICY',
      txHash: 'N/A (BLOCKED_BY_WDK)'
    }
    transactionHistory.unshift(blockedTx)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: false,
      blocked: true,
      error: rogueResult.error,
      simulationLog: [
        'INIT: Threat detected from unauthorized agent hacker-999',
        'RULE: Whitelist Only -> DENY (Address not registered)',
        'RULE: Max Cap 5,000 USDt -> DENY (10,000 USDt exceeds cap)',
        'POLICY ENGINE: PolicyViolationError: Matched rule deny-unauthorized-recipient',
        'DECISION: Transaction BLOCKED before signature/broadcast'
      ]
    }))
    return
  }

  // 4. Endpoint directo de Reclamos x402 (POST /api/payroll/claim)
  if (req.url === '/api/payroll/claim' && req.method === 'POST') {
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

  // 5. Servir archivos estáticos del Dashboard (HTML, CSS, SVG, etc.)
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url)
  const ext = path.extname(filePath)

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    fs.createReadStream(filePath).pipe(res)
  } else {
    const indexPath = path.join(PUBLIC_DIR, 'index.html')
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      fs.createReadStream(indexPath).pipe(res)
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
  console.log(`🛡️ WDK Policy Engine: ACTIVE\n`)
})
