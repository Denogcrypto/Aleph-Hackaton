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
  constructor (options = {}) {
    this.simulatedDate = options.initialDate ? new Date(options.initialDate) : new Date()
    this.defaultPaymentDay = options.defaultPaymentDay || 1
    this.executedCycles = []
  }

  /**
   * Obtiene la fecha simulada actual del sistema.
   * @returns {Date}
   */
  getCurrentDate () {
    return new Date(this.simulatedDate)
  }

  /**
   * Obtiene la fecha en formato ISO (YYYY-MM-DD).
   * @returns {string}
   */
  getFormattedDate () {
    return this.simulatedDate.toISOString().slice(0, 10)
  }

  /**
   * Obtiene el período de nómina actual (YYYY-MM).
   * @returns {string}
   */
  getCurrentPeriod () {
    return this.simulatedDate.toISOString().slice(0, 7)
  }

  /**
   * Establece una fecha simulada arbitraria (Time Warp).
   * @param {string | Date} newDate - Nueva fecha en formato 'YYYY-MM-DD' o Date
   * @returns {string} Fecha actualizada
   */
  setSimulatedDate (newDate) {
    this.simulatedDate = new Date(newDate)
    return this.getFormattedDate()
  }

  /**
   * Adelanta el reloj del sistema hasta el día 1 del siguiente mes (Payday).
   * @returns {{ previousDate: string, newDate: string, period: string }}
   */
  advanceToNextPayday () {
    const previousDate = this.getFormattedDate()
    const year = this.simulatedDate.getFullYear()
    const month = this.simulatedDate.getMonth()

    // Si hoy no es el día 1, o ya pasó el día 1 del mes actual, avanzamos al 1 del próximo mes
    let targetYear = year
    let targetMonth = month
    if (this.simulatedDate.getDate() >= this.defaultPaymentDay) {
      targetMonth = month + 1
      if (targetMonth > 11) {
        targetMonth = 0
        targetYear += 1
      }
    }

    this.simulatedDate = new Date(targetYear, targetMonth, this.defaultPaymentDay, 9, 0, 0)
    const newDate = this.getFormattedDate()
    const period = this.getCurrentPeriod()

    return {
      previousDate,
      newDate,
      period
    }
  }

  /**
   * Verifica si la fecha simulada actual corresponde al día de pago de un empleado.
   * @param {number} [employeePaymentDay=1]
   * @returns {boolean}
   */
  isPaydayForEmployee (employeePaymentDay = 1) {
    return this.simulatedDate.getDate() === employeePaymentDay
  }

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
  async executeScheduledPayroll ({ companyAgent, employeeAgents }) {
    const period = this.getCurrentPeriod()
    const executionDate = this.getFormattedDate()
    const results = []
    let totalAmountUsdt = 0
    let settledCount = 0

    console.log(`\n⏰ [Payroll Scheduler] 📅 Disparando ciclo de nómina para fecha: ${executionDate} (Período: ${period})`)

    for (const employeeAgent of employeeAgents) {
      const isDue = this.isPaydayForEmployee(employeeAgent.paymentDay)
      console.log(`[Payroll Scheduler] Evaluando empleado ${employeeAgent.employeeId} (${employeeAgent.name}) - Día de cobro: ${employeeAgent.paymentDay} -> Elegible: ${isDue}`)

      if (isDue) {
        try {
          // El Employee Agent emite el requerimiento x402 y reclama el pago
          const claimResult = await employeeAgent.claimSalaryFromCompany(companyAgent, period)

          if (claimResult.success) {
            settledCount++
            totalAmountUsdt += employeeAgent.salaryUsdt
            results.push({
              employeeId: employeeAgent.employeeId,
              name: employeeAgent.name,
              amountUsdt: employeeAgent.salaryUsdt,
              status: 'SETTLED',
              receipt: claimResult.receipt,
              txHash: claimResult.receipt.txHash
            })
          } else {
            results.push({
              employeeId: employeeAgent.employeeId,
              name: employeeAgent.name,
              status: 'FAILED',
              error: claimResult.error
            })
          }
        } catch (err) {
          results.push({
            employeeId: employeeAgent.employeeId,
            name: employeeAgent.name,
            status: 'ERROR',
            error: err.message
          })
        }
      }
    }

    const summary = {
      period,
      executionDate,
      settledCount,
      totalAmountUsdt,
      results
    }

    this.executedCycles.push(summary)
    console.log(`[Payroll Scheduler] ✅ Ciclo finalizado. ${settledCount}/${employeeAgents.length} empleados liquidados (${totalAmountUsdt} USD₮)\n`)

    return summary
  }
}
