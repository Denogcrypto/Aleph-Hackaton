// Copyright 2024 Tether Operations Limited
/**
 * @fileoverview Payroll Registry - Base de datos de empleados autorizados y contratos de nómina.
 * Proporciona validación de identidades, salarios y listas blancas para el WDK Policy Engine.
 */

/**
 * @typedef {Object} EmployeeRecord
 * @property {string} employeeId - Identificador único del empleado
 * @property {string} name - Nombre completo del empleado
 * @property {string} walletAddress - Dirección pública de wallet para recepción de USD₮
 * @property {number} salaryUsdt - Monto de salario asignado en USD₮
 * @property {number} paymentDay - Día del mes programado para el pago (1-31)
 * @property {'ACTIVE' | 'PAUSED' | 'TERMINATED'} status - Estado laboral
 */

/**
 * Base de datos en memoria de empleados autorizados.
 * En producción, esto puede conectarse a un ERP o base de datos corporativa.
 * @type {Map<string, EmployeeRecord>}
 */
const employees = new Map([
  [
    'emp-001',
    {
      employeeId: 'emp-001',
      name: 'Alice Developer',
      walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      salaryUsdt: 2500,
      paymentDay: 1,
      status: 'ACTIVE'
    }
  ],
  [
    'emp-002',
    {
      employeeId: 'emp-002',
      name: 'Bob Designer',
      walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      salaryUsdt: 1800,
      paymentDay: 1,
      status: 'ACTIVE'
    }
  ]
])

/**
 * Obtiene el registro de un empleado por su ID.
 * @param {string} employeeId
 * @returns {EmployeeRecord | undefined}
 */
export function getEmployee (employeeId) {
  return employees.get(employeeId)
}

/**
 * Verifica si una dirección de wallet pertenece a un empleado activo (Whitelist).
 * @param {string} address - Dirección de wallet en formato 0x...
 * @returns {boolean}
 */
export function isEmployeeWhitelisted (address) {
  if (!address || typeof address !== 'string') return false
  const normalized = address.toLowerCase()
  for (const emp of employees.values()) {
    if (emp.walletAddress.toLowerCase() === normalized && emp.status === 'ACTIVE') {
      return true
    }
  }
  return false
}

/**
 * Valida si un reclamo de salario coincide con los registros oficiales de la empresa.
 * @param {Object} claim
 * @param {string} claim.employeeId
 * @param {string} claim.walletAddress
 * @param {number} claim.amountUsdt
 * @returns {{ valid: boolean, reason?: string, employee?: EmployeeRecord }}
 */
export function validatePayrollClaim (claim) {
  const employee = getEmployee(claim.employeeId)
  if (!employee) {
    return { valid: false, reason: `Empleado '${claim.employeeId}' no encontrado en el registro.` }
  }

  if (employee.status !== 'ACTIVE') {
    return { valid: false, reason: `El empleado '${claim.employeeId}' no se encuentra en estado ACTIVO.` }
  }

  if (employee.walletAddress.toLowerCase() !== claim.walletAddress.toLowerCase()) {
    return {
      valid: false,
      reason: `La wallet proporcionada (${claim.walletAddress}) no coincide con la registrada (${employee.walletAddress}).`
    }
  }

  if (Number(claim.amountUsdt) !== employee.salaryUsdt) {
    return {
      valid: false,
      reason: `El monto solicitado (${claim.amountUsdt} USD₮) no coincide con el salario contractual (${employee.salaryUsdt} USD₮).`
    }
  }

  return { valid: true, employee }
}

/**
 * Registra o actualiza un empleado en el registro.
 * @param {EmployeeRecord} record
 */
export function registerEmployee (record) {
  employees.set(record.employeeId, record)
}

/**
 * Retorna todos los empleados activos.
 * @returns {EmployeeRecord[]}
 */
export function listActiveEmployees () {
  return Array.from(employees.values()).filter(e => e.status === 'ACTIVE')
}
