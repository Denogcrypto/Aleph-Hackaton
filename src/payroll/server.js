/**
 * @fileoverview Paygent Full-Stack Server
 * Sirve el Dashboard Web interactivo y expone los endpoints x402 del Company Agent.
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { CompanyAgent } from './company-agent.js'
import { parsePaymentHeader } from './x402-protocol.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.join(__dirname, '../../public')

const companyAgent = new CompanyAgent({
  seedPhrase: process.env.COMPANY_SEED_PHRASE || 'test test test test test test test test test test test junk',
  maxSalaryCapUsdt: Number(process.env.MAX_SALARY_PER_TX_USDT) || 5000
})

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

  // Endpoint de Reclamos x402
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

  // Servir archivos estáticos del Dashboard
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url)
  const ext = path.extname(filePath)

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    fs.createReadStream(filePath).pipe(res)
  } else {
    // Fallback a index.html
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
