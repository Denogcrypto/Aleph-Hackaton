export class CompanyAgent {
    /**
     * @param {Object} [config]
     * @param {string} [config.seedPhrase]
     * @param {string} [config.rpcUrl]
     * @param {string} [config.tokenAddress]
     * @param {number} [config.maxSalaryCapUsdt=10000]
     */
    constructor(config?: {
        seedPhrase?: string;
        rpcUrl?: string;
        tokenAddress?: string;
        maxSalaryCapUsdt?: number;
    });
    seedPhrase: string;
    wdkService: WdkPayrollService;
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    /**
     * Obtiene la dirección pública de la tesorería de la empresa.
     * @returns {Promise<string>}
     */
    getTreasuryAddress(): Promise<string>;
    /**
     * Obtiene los balances en vivo on-chain (ETH y USD₮) de la tesorería en Sepolia.
     * @returns {Promise<{ eth: number, usdt: number, rawEth?: string, rawUsdt?: string, error?: string }>}
     */
    getBalances(): Promise<{
        eth: number;
        usdt: number;
        rawEth?: string;
        rawUsdt?: string;
        error?: string;
    }>;
    /**
     * Procesa y liquida un requerimiento de nómina x402 entrante.
     * @param {Object | string} rawClaim - Carga útil x402
     * @returns {Promise<{ success: boolean, receipt?: Object, error?: string, policyResult?: Object }>}
     */
    processPaymentClaim(rawClaim: any | string): Promise<{
        success: boolean;
        receipt?: any;
        error?: string;
        policyResult?: any;
    }>;
    /**
     * Inicia el servidor HTTP x402 del Company Agent.
     * @param {number} [port=3000]
     * @returns {Promise<void>}
     */
    startServer(port?: number): Promise<void>;
    /**
     * Detiene el servidor y libera recursos de WDK.
     */
    stop(): void;
}
import { WdkPayrollService } from './wdk-payroll-service.js';
import http from 'http';
