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
    constructor({ employeeId, name, salaryUsdt, seedPhrase, paymentDay, rpcUrl, tokenAddress }: {
        employeeId: string;
        name: string;
        salaryUsdt: number;
        seedPhrase?: string;
        paymentDay?: number;
        rpcUrl?: string;
        tokenAddress?: string;
    });
    employeeId: string;
    name: string;
    salaryUsdt: number;
    paymentDay: number;
    seedPhrase: string;
    rpcUrl: string;
    tokenAddress: string;
    status: string;
    lastReceipt: any;
    paymentHistory: any[];
    wdk: WDK;
    /**
     * Obtiene la dirección pública de recepción del empleado.
     * @returns {Promise<string>}
     */
    getWalletAddress(): Promise<string>;
    /**
     * Obtiene los balances on-chain en Sepolia del agente empleado.
     * @returns {Promise<{ eth: number, usdt: number }>}
     */
    getBalances(): Promise<{
        eth: number;
        usdt: number;
    }>;
    /**
     * Verifica si la fecha actual corresponde al día de cobro.
     * @param {Date} [currentDate=new Date()]
     * @returns {boolean}
     */
    isPayday(currentDate?: Date): boolean;
    /**
     * Genera el requerimiento estándar x402 de nómina.
     * @param {string} [period]
     * @returns {Promise<Object>} Requerimiento x402
     */
    generatePayrollRequirement(period?: string): Promise<any>;
    /**
     * Genera la carga útil firmada para la cabecera `X-PAYMENT`.
     * @param {string} [period]
     * @returns {Promise<Object>}
     */
    generatePaymentPayload(period?: string): Promise<any>;
    /**
     * Valida y reconoce formalmente el recibo de pago devuelto por el Company Agent.
     * @param {Object} receipt - Recibo X-PAYMENT-RESPONSE
     * @returns {Promise<{ valid: boolean, reason?: string }>}
     */
    validateAndAcknowledgeReceipt(receipt: any): Promise<{
        valid: boolean;
        reason?: string;
    }>;
    /**
     * Reclama el pago de nómina enviando el payload x402 al Company Agent y valida el recibo.
     * @param {import('./company-agent.js').CompanyAgent} companyAgent - Instancia del agente de la empresa
     * @param {string} [period]
     * @returns {Promise<{ success: boolean, receipt?: Object, error?: string }>}
     */
    claimSalaryFromCompany(companyAgent: import("./company-agent.js").CompanyAgent, period?: string): Promise<{
        success: boolean;
        receipt?: any;
        error?: string;
    }>;
    /**
     * Libera recursos de la wallet WDK del empleado.
     */
    dispose(): void;
}
import WDK from '../../index.js';
