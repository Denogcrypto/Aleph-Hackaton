import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { isEmployeeWhitelisted, validatePayrollClaim, registerEmployee } from '../src/payroll/payroll-registry.js'
import { create402Requirement, createPaymentPayload, createPaymentReceipt } from '../src/payroll/x402-protocol.js'
import { WdkPayrollService } from '../src/payroll/wdk-payroll-service.js'
import { CompanyAgent } from '../src/payroll/company-agent.js'
import { EmployeeAgent } from '../src/payroll/employee-agent.js'
import { PayrollScheduler } from '../src/payroll/payroll-scheduler.js'

describe('Autonomous Payroll Agents Test Suite', () => {
  const SEED_PHRASE_COMPANY = 'test test test test test test test test test test test junk'
  const SEED_PHRASE_EMPLOYEE = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'

  describe('1. Payroll Registry & Whitelist Verification', () => {
    test('isEmployeeWhitelisted should return true for registered active employees', () => {
      expect(isEmployeeWhitelisted('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')).toBe(true)
    })

    test('isEmployeeWhitelisted should return false for unknown addresses', () => {
      expect(isEmployeeWhitelisted('0x000000000000000000000000000000000000dEaD')).toBe(false)
      expect(isEmployeeWhitelisted(null)).toBe(false)
    })

    test('validatePayrollClaim should accept valid claims', () => {
      const result = validatePayrollClaim({
        employeeId: 'emp-001',
        walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        amountUsdt: 2500
      })
      expect(result.valid).toBe(true)
      expect(result.employee).toBeDefined()
    })

    test('validatePayrollClaim should reject unregistered employee IDs', () => {
      const result = validatePayrollClaim({
        employeeId: 'emp-999',
        walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        amountUsdt: 2500
      })
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('no encontrado')
    })

    test('validatePayrollClaim should reject mismatched salary amounts', () => {
      const result = validatePayrollClaim({
        employeeId: 'emp-001',
        walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        amountUsdt: 9999
      })
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('no coincide con el salario')
    })
  })

  describe('2. x402 Protocol Header & Payload Specifications', () => {
    test('create402Requirement should generate standard x402 v1 payload', () => {
      const req = create402Requirement({
        employeeId: 'emp-001',
        walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        amountUsdt: 2500,
        chainId: 11155111,
        period: '2026-09'
      })

      expect(req.x402Version).toBe(1)
      expect(req.status).toBe(402)
      expect(req.accepts).toHaveLength(1)
      expect(req.accepts[0].network).toBe('eip155:11155111')
      expect(req.accepts[0].amountUsdt).toBe(2500)
      expect(req.accepts[0].payTo).toBe('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      expect(req.accepts[0].extra.employeeId).toBe('emp-001')
    })

    test('createPaymentReceipt should format X-PAYMENT-RESPONSE receipt with Sepolia explorer URL', () => {
      const receipt = createPaymentReceipt({
        txHash: '0xabc123',
        employeeId: 'emp-001',
        walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        amountUsdt: 2500
      })

      expect(receipt.x402Version).toBe(1)
      expect(receipt.status).toBe('SETTLED')
      expect(receipt.txHash).toBe('0xabc123')
      expect(receipt.currency).toBe('USD₮')
      expect(receipt.network).toBe('eip155:11155111')
      expect(receipt.explorerUrl).toBe('https://sepolia.etherscan.io/tx/0xabc123')
    })
  })

  describe('3. WDK Core & Policy Engine Enforcement', () => {
    let wdkService

    beforeAll(() => {
      wdkService = new WdkPayrollService({
        seedPhrase: SEED_PHRASE_COMPANY,
        maxSalaryCapUsdt: 3000
      })
    })

    afterAll(() => {
      wdkService.dispose()
    })

    test('should derive corporate treasury address via WDK', async () => {
      const address = await wdkService.getAddress(0)
      expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })

    test('WDK Policy Engine should DENY transfer to unauthorized recipient', async () => {
      const sim = await wdkService.simulatePayrollPayment({
        recipient: '0x000000000000000000000000000000000000dEaD',
        amountUnits: '1000000000'
      })

      expect(sim.decision).toBe('DENY')
      expect(sim.matched_rule).toBe('deny-unauthorized-recipient')
    })

    test('WDK Policy Engine should DENY transfer exceeding salary cap', async () => {
      const sim = await wdkService.simulatePayrollPayment({
        recipient: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        amountUnits: '5000000000' // 5,000 USDT > 3,000 cap
      })

      expect(sim.decision).toBe('DENY')
      expect(sim.matched_rule).toBe('deny-over-budget')
    })

    test('WDK Policy Engine should ALLOW valid whitelisted transfer under cap', async () => {
      const sim = await wdkService.simulatePayrollPayment({
        recipient: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        amountUnits: '2500000000' // 2,500 USDT <= 3,000 cap
      })

      expect(sim.decision).toBe('ALLOW')
    })
  })

  describe('4. Autonomous Agent-to-Agent End-to-End Flow & Receipt Validation', () => {
    let companyAgent
    let employeeAgent

    beforeAll(async () => {
      companyAgent = new CompanyAgent({
        seedPhrase: SEED_PHRASE_COMPANY,
        maxSalaryCapUsdt: 5000
      })

      employeeAgent = new EmployeeAgent({
        employeeId: 'emp-001',
        name: 'Alice Developer',
        salaryUsdt: 2500,
        seedPhrase: SEED_PHRASE_EMPLOYEE
      })

      const aliceAddress = await employeeAgent.getWalletAddress()
      registerEmployee({
        employeeId: 'emp-001',
        name: 'Alice Developer',
        walletAddress: aliceAddress,
        salaryUsdt: 2500,
        paymentDay: 1,
        status: 'ACTIVE'
      })
    })

    afterAll(() => {
      companyAgent.stop()
      employeeAgent.dispose()
    })

    test('Employee Agent successfully claims, verifies receipt, and updates status to PAID_CONFIRMED', async () => {
      const response = await employeeAgent.claimSalaryFromCompany(companyAgent, '2026-09')

      expect(response.success).toBe(true)
      expect(response.receipt).toBeDefined()
      expect(response.receipt.status).toBe('SETTLED')
      expect(response.receipt.amountUsdt).toBe(2500)
      expect(response.receipt.currency).toBe('USD₮')
      expect(response.receipt.network).toBe('eip155:11155111')
      expect(response.receipt.explorerUrl).toContain('https://sepolia.etherscan.io/tx/')
      expect(employeeAgent.status).toBe('PAID_CONFIRMED')
      expect(employeeAgent.paymentHistory).toHaveLength(1)
    })

    test('Company Agent rejects unwhitelisted employee claim', async () => {
      const response = await companyAgent.processPaymentClaim({
        employeeId: 'emp-unknown',
        walletAddress: '0x1234567890123456789012345678901234567890',
        amountUsdt: 1000
      })

      expect(response.success).toBe(false)
      expect(response.error).toContain('Validation Error')
    })
  })

  describe('5. Payroll Scheduler & Time Warp Execution', () => {
    let scheduler
    let companyAgent
    let employeeAgent

    beforeAll(async () => {
      scheduler = new PayrollScheduler({
        initialDate: '2026-08-22',
        defaultPaymentDay: 1
      })

      companyAgent = new CompanyAgent({
        seedPhrase: SEED_PHRASE_COMPANY,
        maxSalaryCapUsdt: 5000
      })

      employeeAgent = new EmployeeAgent({
        employeeId: 'emp-001',
        name: 'Alice Developer',
        salaryUsdt: 2500,
        paymentDay: 1,
        seedPhrase: SEED_PHRASE_EMPLOYEE
      })

      const aliceAddress = await employeeAgent.getWalletAddress()
      registerEmployee({
        employeeId: 'emp-001',
        name: 'Alice Developer',
        walletAddress: aliceAddress,
        salaryUsdt: 2500,
        paymentDay: 1,
        status: 'ACTIVE'
      })
    })

    afterAll(() => {
      companyAgent.stop()
      employeeAgent.dispose()
    })

    test('advanceToNextPayday should fast forward the clock to Day 1 of next month', () => {
      const result = scheduler.advanceToNextPayday()
      expect(result.newDate).toBe('2026-09-01')
      expect(result.period).toBe('2026-09')
      expect(scheduler.isPaydayForEmployee(1)).toBe(true)
    })

    test('executeScheduledPayroll should trigger and settle eligible employee agents on Day 1', async () => {
      const summary = await scheduler.executeScheduledPayroll({
        companyAgent,
        employeeAgents: [employeeAgent]
      })

      expect(summary.settledCount).toBe(1)
      expect(summary.totalAmountUsdt).toBe(2500)
      expect(summary.period).toBe('2026-09')
      expect(summary.results[0].status).toBe('SETTLED')
      expect(summary.results[0].txHash).toMatch(/^0x/)
    })
  })

  describe('6. Dynamic Agent Registration & Whitelist Verification', () => {
    test('registerEmployee should add a new employee agent to whitelist and enable settlement', async () => {
      const charlieAddress = '0x71bE63f3384f5fb98995898A86B02Fb2426c5788'
      expect(isEmployeeWhitelisted(charlieAddress)).toBe(false)

      registerEmployee({
        employeeId: 'emp-004',
        name: 'Charlie Security',
        walletAddress: charlieAddress,
        salaryUsdt: 3200,
        paymentDay: 1,
        status: 'ACTIVE'
      })

      expect(isEmployeeWhitelisted(charlieAddress)).toBe(true)

      const validation = validatePayrollClaim({
        employeeId: 'emp-004',
        walletAddress: charlieAddress,
        amountUsdt: 3200
      })
      expect(validation.valid).toBe(true)
      expect(validation.employee.name).toBe('Charlie Security')
    })

    test('validatePayrollClaim should reject tampered salary amount for dynamic agent', () => {
      const charlieAddress = '0x71bE63f3384f5fb98995898A86B02Fb2426c5788'
      const validation = validatePayrollClaim({
        employeeId: 'emp-004',
        walletAddress: charlieAddress,
        amountUsdt: 4500 // Exceeds contract salary of 3200
      })
      expect(validation.valid).toBe(false)
      expect(validation.reason).toContain('no coincide con el salario contractual')
    })
  })
})
