/**
 * @fileoverview Payroll Scheduler - Programador autónomo de nómina y simulación de adelanto temporal (Time Warp).
 * Detecta el día 1 de cada ciclo de cobro, despierta a los agentes empleados y orquesta el flujo x402.
 */
export class PayrollScheduler {
    /**
     * @param {Object} [options]
     * @param {string | Date} [options.initialDate] - Fecha de inicio del reloj (por defecto fecha actual)
     * @param {number} [options.defaultPaymentDay=1] - Día por defecto para el pago de nómina
     */
    constructor(options?: {
        initialDate?: string | Date;
        defaultPaymentDay?: number;
    });
    simulatedDate: Date;
    defaultPaymentDay: number;
    executedCycles: any[];
    /**
     * Obtiene la fecha simulada actual del sistema.
     * @returns {Date}
     */
    getCurrentDate(): Date;
    /**
     * Obtiene la fecha en formato ISO (YYYY-MM-DD).
     * @returns {string}
     */
    getFormattedDate(): string;
    /**
     * Obtiene el período de nómina actual (YYYY-MM).
     * @returns {string}
     */
    getCurrentPeriod(): string;
    /**
     * Establece una fecha simulada arbitraria (Time Warp).
     * @param {string | Date} newDate - Nueva fecha en formato 'YYYY-MM-DD' o Date
     * @returns {string} Fecha actualizada
     */
    setSimulatedDate(newDate: string | Date): string;
    /**
     * Adelanta el reloj del sistema hasta el día 1 del siguiente mes (Payday).
     * @returns {{ previousDate: string, newDate: string, period: string }}
     */
    advanceToNextPayday(): {
        previousDate: string;
        newDate: string;
        period: string;
    };
    /**
     * Verifica si la fecha simulada actual corresponde al día de pago de un empleado.
     * @param {number} [employeePaymentDay=1]
     * @returns {boolean}
     */
    isPaydayForEmployee(employeePaymentDay?: number): boolean;
    /**
     * Ejecuta el ciclo de nómina programado para todos los agentes empleados elegibles.
     * @param {Object} params
     * @param {import('./company-agent.js').CompanyAgent} params.companyAgent - Agente de tesorería
     * @param {Array<import('./employee-agent.js').EmployeeAgent>} params.employeeAgents - Lista de agentes empleados
     * @returns {Promise<{
     *   period: string,
     *   executionDate: string,
     *   settledCount: number,
     *   totalAmountUsdt: number,
     *   results: Array<Object>
     * }>}
     */
    executeScheduledPayroll({ companyAgent, employeeAgents }: {
        companyAgent: import("./company-agent.js").CompanyAgent;
        employeeAgents: Array<import("./employee-agent.js").EmployeeAgent>;
    }): Promise<{
        period: string;
        executionDate: string;
        settledCount: number;
        totalAmountUsdt: number;
        results: Array<any>;
    }>;
}
