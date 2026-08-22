/**
 * Obtiene el registro de un empleado por su ID.
 * @param {string} employeeId
 * @returns {EmployeeRecord | undefined}
 */
export function getEmployee(employeeId: string): EmployeeRecord | undefined;
/**
 * Verifica si una dirección de wallet pertenece a un empleado activo (Whitelist).
 * @param {string} address - Dirección de wallet en formato 0x...
 * @returns {boolean}
 */
export function isEmployeeWhitelisted(address: string): boolean;
/**
 * Valida si un reclamo de salario coincide con los registros oficiales de la empresa.
 * @param {Object} claim
 * @param {string} claim.employeeId
 * @param {string} claim.walletAddress
 * @param {number} claim.amountUsdt
 * @returns {{ valid: boolean, reason?: string, employee?: EmployeeRecord }}
 */
export function validatePayrollClaim(claim: {
    employeeId: string;
    walletAddress: string;
    amountUsdt: number;
}): {
    valid: boolean;
    reason?: string;
    employee?: EmployeeRecord;
};
/**
 * Registra o actualiza un empleado en el registro.
 * @param {EmployeeRecord} record
 */
export function registerEmployee(record: EmployeeRecord): void;
/**
 * Retorna todos los empleados activos.
 * @returns {EmployeeRecord[]}
 */
export function listActiveEmployees(): EmployeeRecord[];
export type EmployeeRecord = {
    /**
     * - Identificador único del empleado
     */
    employeeId: string;
    /**
     * - Nombre completo del empleado
     */
    name: string;
    /**
     * - Dirección pública de wallet para recepción de USD₮
     */
    walletAddress: string;
    /**
     * - Monto de salario asignado en USD₮
     */
    salaryUsdt: number;
    /**
     * - Día del mes programado para el pago (1-31)
     */
    paymentDay: number;
    /**
     * - Estado laboral
     */
    status: "ACTIVE" | "PAUSED" | "TERMINATED";
};
