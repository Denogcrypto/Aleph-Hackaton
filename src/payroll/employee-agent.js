/**
 * @fileoverview Employee Agent - Agente autónomo que representa al colaborador.
 * Gestiona su wallet WDK, detecta fechas de pago, genera requerimientos x402
 * y valida la recepción de fondos en USD₮.
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
   * @param {string} [options.rpcUrl] - RPC de la red
   * @param {string} [options.tokenAddress] - Dirección de USD₮
   */
  constructor ({
    employeeId,
    name,
    salaryUsdt,
    seedPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    paymentDay = 1,
    rpcUrl = 'https://ethereum-sepolia-rpc.publicnode.com',
    tokenAddress = '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0'
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

    // Inicialización de la wallet WDK del empleado
    this.wdk = new WDK(this.seedPhrase)
      .registerWallet('ethereum', WalletManagerEvm, {
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
    const address = await account.getAddress()
    const signature = await account.sign(`Payroll Claim: ${this.employeeId} - ${this.salaryUsdt} USDT`)
    return createPaymentPayload(requirement, signature)
  }

  /**
   * Reclama el pago de nómina enviando el payload x402 al Company Agent.
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
      this.status = 'PAID_CONFIRMED'
      this.lastReceipt = response.receipt
      console.log(`[Employee Agent - ${this.name}] 🎉 ¡Salario liquidado y confirmado! Tx: ${response.receipt.txHash}`)
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
