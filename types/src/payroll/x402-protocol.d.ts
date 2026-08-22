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
export function create402Requirement({ employeeId, walletAddress, amountUsdt, assetAddress, chainId, period }: {
    employeeId: string;
    walletAddress: string;
    amountUsdt: number;
    assetAddress?: string;
    chainId?: number;
    period?: string;
}): any;
/**
 * Construye la carga útil enviada en la cabecera `X-PAYMENT` por el Employee Agent.
 * @param {Object} requirement - Requerimiento x402 previamente generado
 * @param {string} [signature] - Firma opcional de autorización
 * @returns {Object} Payload para X-PAYMENT
 */
export function createPaymentPayload(requirement: any, signature?: string): any;
/**
 * Parsea y valida el contenido de la cabecera o payload `X-PAYMENT`.
 * @param {string | Object} headerValue
 * @returns {Object}
 */
export function parsePaymentHeader(headerValue: string | any): any;
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
export function createPaymentReceipt({ txHash, employeeId, walletAddress, amountUsdt, amountEth, currency, network }: {
    txHash: string;
    employeeId: string;
    walletAddress: string;
    amountUsdt: number;
    network?: string;
}): any;
