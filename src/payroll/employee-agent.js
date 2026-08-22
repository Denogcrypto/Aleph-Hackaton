// Copyright 2024 Tether Operations Limited
/**
 * @fileoverview Employee Agent - Agente autónomo que representa al colaborador.
 * Gestiona su wallet WDK, detecta fechas de pago, genera requerimientos x402,
 * valida recibos on-chain y mantiene constancia de sus liquidaciones.
 */

import WDK from '../../index.js'
import WalletManagerEvm from '@tetherto/wdk-wallet-evm'
import { create402Requirement, createPaymentPayload } from './x402-protocol.js'

export class EmployeeAgent {
  /**
   * @param {Object} options
   * @param {string} options.employeeId - Identificador del empleado (ej. 'emp-001')
   * @param {string} options.name - Nombre del empleado
   * @param {number} options.salaryUsdt - Salario pactado en USD₮
   * @param {string} [options.seedPhrase] - Frase semilla BIP-39 de la wallet del empleado
   * @param {number} [options.paymentDay=1] - Día del mes de cobro
   * @param {string} [options.rpcUrl] - RPC de la red Ethereum Sepolia
   * @param {string} [options.tokenAddress] - Dirección de USD₮ en Sepolia
   */
  constructor ({
    employeeId,
    name,
    salaryUsdt,
    seedPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    paymentDay = 1,
    rpcUrl = 'https://ethereum-sepolia-rpc.publicnode.com',
    tokenAddress = '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
  }) {
    this.employeeId = employeeId
    this.name = name
    this.salaryUsdt = salaryUsdt
    this.paymentDay = paymentDay
    this.seedPhrase = seedPhrase
    this.rpcUrl = rpcUrl
    this.tokenAddress = tokenAddress
    this.status = 'INITIAL'
    this.lastReceipt = null
    this.paymentHistory = []

    // Inicialización de la wallet WDK del empleado
    this.wdk = new WDK(this.seedPhrase)
      .registerWallet('ethereum', WalletManagerEvm, {
        provider: this.rpcUrl,
        chainId: 11155111,
        rpcUrl: this.rpcUrl,
        tokenAddress: this.tokenAddress
      })
  }

  /**
   * Obtiene la dirección pública de recepción del empleado.
   * @returns {Promise<string>}
   */
  async getWalletAddress () {
    const account = await this.wdk.getAccount('ethereum', 0)
    return await account.getAddress()
  }

  /**
   * Obtiene los balances on-chain en Sepolia del agente empleado.
   * @returns {Promise<{ eth: number, usdt: number }>}
   */
  async getBalances () {
    try {
      const account = await this.wdk.getAccount('ethereum', 0)
      const ethWei = await account.getBalance()
      const usdtUnits = await account.getTokenBalance(this.tokenAddress)
      return {
        eth: Number(ethWei) / 1e18,
        usdt: Number(usdtUnits) / 1e6
      }
    } catch {
      return { eth: 0, usdt: 0 }
    }
  }

  /**
   * Verifica si la fecha actual corresponde al día de cobro.
   * @param {Date} [currentDate=new Date()]
   * @returns {boolean}
   */
  isPayday (currentDate = new Date()) {
    return currentDate.getDate() === this.paymentDay
  }

  /**
   * Genera el requerimiento estándar x402 de nómina.
   * @param {string} [period]
   * @returns {Promise<Object>} Requerimiento x402
   */
  async generatePayrollRequirement (period) {
    const walletAddress = await this.getWalletAddress()
    return create402Requirement({
      employeeId: this.employeeId,
      walletAddress,
      amountUsdt: this.salaryUsdt,
      assetAddress: this.tokenAddress,
      period
    })
  }

  /**
   * Genera la carga útil firmada para la cabecera `X-PAYMENT`.
   * @param {string} [period]
   * @returns {Promise<Object>}
   */
  async generatePaymentPayload (period) {
    const requirement = await this.generatePayrollRequirement(period)
    const account = await this.wdk.getAccount('ethereum', 0)
    const signature = await account.sign(`Payroll Claim: ${this.employeeId} - ${this.salaryUsdt} USDT - ${period || 'current'}`)
    return createPaymentPayload(requirement, signature)
  }

  /**
   * Valida y reconoce formalmente el recibo de pago devuelto por el Company Agent.
   * @param {Object} receipt - Recibo X-PAYMENT-RESPONSE
   * @returns {Promise<{ valid: boolean, reason?: string }>}
   */
  async validateAndAcknowledgeReceipt (receipt) {
    const myAddress = await this.getWalletAddress()

    if (!receipt || receipt.status !== 'SETTLED') {
      this.status = 'RECEIPT_VALIDATION_FAILED'
      return { valid: false, reason: 'Recibo ausente o estado no liquidado' }
    }

    if (receipt.recipient?.toLowerCase() !== myAddress.toLowerCase()) {
      this.status = 'RECEIPT_VALIDATION_FAILED'
      return { valid: false, reason: `Dirección receptora no coincide: ${receipt.recipient} vs ${myAddress}` }
    }

    if (receipt.amountUsdt !== this.salaryUsdt) {
      this.status = 'RECEIPT_VALIDATION_FAILED'
      return { valid: false, reason: `Monto liquidado no coincide: ${receipt.amountUsdt} vs ${this.salaryUsdt}` }
    }

    if (receipt.network !== 'eip155:11155111') {
      this.status = 'RECEIPT_VALIDATION_FAILED'
      return { valid: false, reason: `Red inválida: ${receipt.network} (Debe ser Sepolia eip155:11155111)` }
    }

    if (!receipt.txHash || !receipt.txHash.startsWith('0x')) {
      this.status = 'RECEIPT_VALIDATION_FAILED'
      return { valid: false, reason: 'Hash de transacción inválido' }
    }

    // Recibo verificado con éxito
    this.status = 'PAID_CONFIRMED'
    this.lastReceipt = receipt
    this.paymentHistory.push({
      ...receipt,
      acknowledgedAt: new Date().toISOString(),
      explorerUrl: `https://sepolia.etherscan.io/tx/${receipt.txHash}`
    })

    console.log(`[Employee Agent - ${this.name}] ✅ Recibo x402 validado y reconocido exitosamente. Tx: ${receipt.txHash}`)
    return { valid: true }
  }

  /**
   * Reclama el pago de nómina enviando el payload x402 al Company Agent y valida el recibo.
   * @param {import('./company-agent.js').CompanyAgent} companyAgent - Instancia del agente de la empresa
   * @param {string} [period]
   * @returns {Promise<{ success: boolean, receipt?: Object, error?: string }>}
   */
  async claimSalaryFromCompany (companyAgent, period) {
    console.log(`[Employee Agent - ${this.name}] 📅 Iniciando reclamo de salario para período ${period || 'actual'}...`)
    this.status = 'CLAIM_SUBMITTED'

    const paymentPayload = await this.generatePaymentPayload(period)
    const response = await companyAgent.processPaymentClaim(paymentPayload)

    if (response.success) {
      const validation = await this.validateAndAcknowledgeReceipt(response.receipt)
      if (validation.valid) {
        console.log(`[Employee Agent - ${this.name}] 🎉 ¡Salario liquidado y confirmado! Tx: ${response.receipt.txHash}`)
      } else {
        console.warn(`[Employee Agent - ${this.name}] ⚠️ Fallo en validación del recibo: ${validation.reason}`)
      }
    } else {
      this.status = 'REJECTED'
      console.error(`[Employee Agent - ${this.name}] ❌ El reclamo fue rechazado: ${response.error}`)
    }

    return response
  }

  /**
   * Libera recursos de la wallet WDK del empleado.
   */
  dispose () {
    this.wdk.dispose()
  }
}
