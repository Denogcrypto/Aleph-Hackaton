// Copyright 2024 Tether Operations Limited
/**
 * @fileoverview x402 Protocol Implementation for Autonomous Payroll.
 * Implementa la especificación HTTP 402 Payment Required para la negociación, cobro
 * y comprobante criptográfico de salarios entre agentes en Ethereum Sepolia (USD₮).
 */

/**
 * Genera el cuerpo de una respuesta HTTP 402 Payment Required según el estándar x402.
 * @param {Object} params
 * @param {string} params.employeeId - Identificador del empleado solicitante
 * @param {string} params.walletAddress - Dirección de recepción de USD₮
 * @param {number} params.amountUsdt - Monto en USD₮
 * @param {string} [params.assetAddress] - Dirección del contrato USD₮ en Sepolia
 * @param {number} [params.chainId=11155111] - ID de la cadena EVM (Ethereum Sepolia: 11155111)
 * @param {string} [params.period] - Período de pago (ej. '2026-09')
 * @returns {Object} Payload JSON x402
 */
export function create402Requirement ({
  employeeId,
  walletAddress,
  amountUsdt,
  assetAddress = '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
  chainId = 11155111,
  period = new Date().toISOString().slice(0, 7)
}) {
  // Conversión a unidades mínimas (6 decimales para USD₮: 1 USD₮ = 1,000,000 unidades)
  const amountInUnits = (BigInt(Math.round(amountUsdt * 100)) * 10000n).toString()

  return {
    x402Version: 1,
    status: 402,
    message: 'Payment Required - Autonomous Payroll Claim',
    accepts: [
      {
        scheme: 'exact',
        network: `eip155:${chainId}`,
        maxAmountRequired: amountInUnits,
        amountUsdt,
        asset: assetAddress,
        payTo: walletAddress,
        extra: {
          employeeId,
          period,
          concept: `Salary settlement for ${period}`,
          timestamp: new Date().toISOString()
        }
      }
    ]
  }
}

/**
 * Construye la carga útil enviada en la cabecera `X-PAYMENT` por el Employee Agent.
 * @param {Object} requirement - Requerimiento x402 previamente generado
 * @param {string} [signature] - Firma opcional de autorización
 * @returns {Object} Payload para X-PAYMENT
 */
export function createPaymentPayload (requirement, signature = '0x_simulated_eip3009_auth') {
  const acceptOption = requirement.accepts[0]
  return {
    x402Version: 1,
    scheme: acceptOption.scheme,
    network: acceptOption.network,
    asset: acceptOption.asset,
    payTo: acceptOption.payTo,
    amount: acceptOption.maxAmountRequired,
    amountUsdt: acceptOption.amountUsdt,
    employeeId: acceptOption.extra.employeeId,
    period: acceptOption.extra.period,
    authorizationSignature: signature,
    submittedAt: new Date().toISOString()
  }
}

/**
 * Parsea y valida el contenido de la cabecera o payload `X-PAYMENT`.
 * @param {string | Object} headerValue
 * @returns {Object}
 */
export function parsePaymentHeader (headerValue) {
  if (typeof headerValue === 'string') {
    try {
      return JSON.parse(headerValue)
    } catch {
      try {
        const decoded = Buffer.from(headerValue, 'base64').toString('utf8')
        return JSON.parse(decoded)
      } catch (err) {
        throw new Error(`Cabecera X-PAYMENT inválida: ${err.message}`)
      }
    }
  }
  return headerValue
}

/**
 * Construye la respuesta de confirmación `X-PAYMENT-RESPONSE` devuelta por el Company Agent tras la liquidación.
 * @param {Object} params
 * @param {string} params.txHash - Hash de la transacción en Ethereum Sepolia
 * @param {string} params.employeeId - Identificador del empleado
 * @param {string} params.walletAddress - Dirección receptora
 * @param {number} params.amountUsdt - Monto transferido
 * @param {string} [params.network] - Identificador de la red (Sepolia)
 * @returns {Object} Recibo formal de nómina x402 con URL de Etherscan
 */
export function createPaymentReceipt ({
  txHash,
  employeeId,
  walletAddress,
  amountUsdt,
  amountEth = 0.0001,
  currency = 'USD₮',
  network = 'eip155:11155111'
}) {
  return {
    x402Version: 1,
    status: 'SETTLED',
    txHash,
    network,
    employeeId,
    recipient: walletAddress,
    amountUsdt,
    amountEth,
    currency,
    explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
    settledAt: new Date().toISOString()
  }
}
