export { PolicyViolationError };
/**
 * Servicio centralizado de nómina que orquesta WDK y el motor de políticas.
 */
export class WdkPayrollService {
    /**
     * @param {Object} options
     * @param {string} options.seedPhrase - Frase semilla BIP-39 de la tesorería
     * @param {string} [options.rpcUrl] - URL RPC de la red EVM (ej. Sepolia)
     * @param {string} [options.tokenAddress] - Dirección del contrato USD₮
     * @param {number} [options.maxSalaryCapUsdt=10000] - Límite máximo por pago en USD₮
     */
    constructor({ seedPhrase, rpcUrl, tokenAddress, maxSalaryCapUsdt }: {
        seedPhrase: string;
        rpcUrl?: string;
        tokenAddress?: string;
        maxSalaryCapUsdt?: number;
    });
    seedPhrase: string;
    rpcUrl: string;
    tokenAddress: string;
    maxSalaryCapUsdt: number;
    maxSalaryCapUnits: bigint;
    wdk: WDK;
    /**
     * Registra las reglas de seguridad en el Policy Engine de WDK.
     * @private
     */
    private _registerPayrollPolicies;
    /**
     * Obtiene la cuenta WDK en el índice indicado.
     * @param {number} [index=0]
     * @returns {Promise<import('@tetherto/wdk-wallet').IWalletAccount>}
     */
    getAccount(index?: number): Promise<import("@tetherto/wdk-wallet").IWalletAccount>;
    /**
     * Obtiene la dirección pública de la cuenta corporativa.
     * @param {number} [index=0]
     * @returns {Promise<string>}
     */
    getAddress(index?: number): Promise<string>;
    /**
     * Simula la transferencia de nómina a través del Policy Engine de WDK sin emitir transacción.
     * @param {Object} params
     * @param {string} params.recipient - Dirección del empleado
     * @param {bigint | string} params.amountUnits - Monto en unidades mínimas de USD₮
     * @returns {Promise<{ decision: 'ALLOW' | 'DENY', reason?: string, matched_rule?: string }>}
     */
    simulatePayrollPayment({ recipient, amountUnits }: {
        recipient: string;
        amountUnits: bigint | string;
    }): Promise<{
        decision: "ALLOW" | "DENY";
        reason?: string;
        matched_rule?: string;
    }>;
    /**
     * Ejecuta el pago de nómina en USD₮ utilizando la cuenta gobernada por WDK.
     * @param {Object} params
     * @param {string} params.recipient - Dirección del empleado
     * @param {bigint | string} params.amountUnits - Monto en unidades mínimas
     * @returns {Promise<{ hash: string, fee?: bigint }>}
     */
    executePayrollPayment({ recipient, amountUnits }: {
        recipient: string;
        amountUnits: bigint | string;
    }): Promise<{
        hash: string;
        fee?: bigint;
    }>;
    /**
     * Obtiene los balances en vivo on-chain (ETH para gas y USD₮) de la cuenta en Sepolia.
     * @param {number} [index=0]
     * @returns {Promise<{ eth: number, usdt: number, rawEth?: string, rawUsdt?: string, error?: string }>}
     */
    getOnChainBalances(index?: number): Promise<{
        eth: number;
        usdt: number;
        rawEth?: string;
        rawUsdt?: string;
        error?: string;
    }>;
    /**
     * Ejecuta una transferencia utilizando WDK CLI (`wdk send --json`) para compatibilidad con Pista 1.
     * @param {Object} params
     * @param {string} params.to - Dirección de destino
     * @param {number | string} params.amountUsdt - Monto en USD₮
     * @returns {Object} Resultado estructurado JSON
     */
    executeViaCli({ to, amountUsdt }: {
        to: string;
        amountUsdt: number | string;
    }): any;
    /**
     * Libera las claves privadas y recursos de memoria de WDK de forma segura.
     */
    dispose(): void;
}
import { PolicyViolationError } from '../../index.js';
import WDK from '../../index.js';
