🛠️ Requisitos Previos en tu Entorno Local
Para ejecutar este proyecto, asegúrate de contar con lo siguiente en tu máquina:
Node.js 22.18.0 o posterior
.
El paquete oficial de la CLI de WDK: @tetherto/wdk-cli
.
Una billetera de prueba (nunca uses una billetera personal con fondos reales)
.
🧠 Arquitectura de Integración (x402 + WDK)
La interacción económica de tus agentes se estructurará de la siguiente manera utilizando la infraestructura de WDK
:
Employee Agent (Agente Empleado):
Monitorea la fecha de pago
.
Genera un requerimiento de pago bajo el protocolo x402 (Payment Required) en formato JSON
.
Utiliza wdk get para monitorear su dirección y detectar cuándo entra el pago en USD₮
.
Company Agent (Agente Empresa):
Recibe el requerimiento x402 de pago
.
Valida el ID del empleado, dirección de wallet, monto y fecha
.
Ejecuta el pago de forma autónoma llamando programáticamente a la CLI de WDK mediante wdk send
.
💻 Guía de Implementación Paso a Paso
Paso 1: Configurar las Wallets con la CLI de WDK
En tu máquina local, inicializa las wallets para tus agentes ejecutando los comandos de la CLI
:
# Crear la wallet del Company Agent
wdk create --name company_wallet

# Crear la wallet del Employee Agent
wdk create --name employee_wallet
Guarda de forma segura las claves y direcciones generadas en tu archivo local .env
.
Paso 2: Implementar el Employee Agent (Generador de Requerimientos)
Este script de Node.js simula el comportamiento del agente del empleado. Detecta la fecha de cobro, genera el archivo x402 y monitorea la recepción del pago
.
// employee-agent.js
import { execSync } from 'child_process';
import fs from 'fs';

const EMPLOYEE_ID = "employee_001";
const SALARY_AMOUNT = "1000"; // USD₮
const EMPLOYEE_WALLET = "0xYourEmployeeWalletAddress..."; // Dirección derivada de WDK
const PAYROLL_DAY = 1; // Día 1 de cada mes

function checkAndRequestPayroll() {
    const today = new Date();
    
    // 1. Detectar fecha de pago
    if (today.getDate() === PAYROLL_DAY) {
        console.log(`[Employee Agent] ¡Es día de pago! Generando requerimiento x402...`);
        
        // 2. Crear requerimiento de pago x402 (JSON)
        const paymentRequirement = {
            "employee_id": EMPLOYEE_ID,
            "wallet": EMPLOYEE_WALLET,
            "amount": SALARY_AMOUNT,
            "currency": "USDT",
            "payment_reason": "Monthly salary",
            "due_date": today.toISOString().split('T')
        };

        // Guardar el requerimiento para que el Company Agent lo consuma
        fs.writeFileSync('x402_payment_request.json', JSON.stringify(paymentRequirement, null, 2));
        console.log(`[Employee Agent] Requerimiento x402 enviado.`);
        
        // 3. Comenzar a monitorear la wallet con WDK CLI
        monitorWallet();
    }
}

function monitorWallet() {
    console.log(`[Employee Agent] Monitoreando wallet ${EMPLOYEE_WALLET} para detectar el pago...`);
    
    // Intervalo de consulta cada 10 segundos para propósitos del MVP
    const interval = setInterval(() => {
        try {
            // Usamos 'wdk get' para revisar el balance o transacciones entrantes
            const output = execSync(`wdk get --address ${EMPLOYEE_WALLET} --json`).toString();
            const walletData = JSON.parse(output);
            
            // Lógica para verificar si se recibió el monto esperado
            if (walletData.balance && parseFloat(walletData.balance.USDT) >= parseFloat(SALARY_AMOUNT)) {
                console.log(`[Employee Agent] 🎉 ¡Pago de ${SALARY_AMOUNT} USD₮ recibido con éxito en la blockchain!`);
                clearInterval(interval);
            }
        } catch (error) {
            console.error("[Employee Agent] Error al consultar la wallet:", error.message);
        }
    }, 10000);
}

checkAndRequestPayroll();
Paso 3: Implementar el Company Agent (Validador y Pagador con WDK)
Este agente se mantiene a la escucha, recibe la solicitud de nómina en formato JSON, la contrasta contra una base de datos interna de empleados autorizados y dispara el pago mediante wdk send
.
// company-agent.js
import { execSync } from 'child_process';
import fs from 'fs';

// Base de datos local de empleados autorizados para validar el cobro
const AUTHORIZED_EMPLOYEES = {
    "employee_001": {
        wallet: "0xYourEmployeeWalletAddress...",
        salary: "1000"
    }
};

function processPaymentRequirement() {
    const requestPath = 'x402_payment_request.json';
    
    if (!fs.existsSync(requestPath)) {
        console.log("[Company Agent] Esperando requerimientos de pago x402...");
        return;
    }

    console.log("[Company Agent] Requerimiento detectado. Iniciando validación...");
    const rawData = fs.readFileSync(requestPath);
    const paymentRequest = JSON.parse(rawData);

    const { employee_id, wallet, amount, currency } = paymentRequest;

    // 1. Validar identidad del empleado y correspondencia de datos
    const record = AUTHORIZED_EMPLOYEES[employee_id];
    if (!record) {
        console.error(`[Company Agent] Error: Empleado ${employee_id} no está registrado.`);
        return;
    }

    if (record.wallet.toLowerCase() !== wallet.toLowerCase() || record.salary !== amount) {
        console.error("[Company Agent] Error de validación: La wallet o el monto no coinciden con los registros autorizados.");
        return;
    }

    if (currency !== "USDT") {
        console.error("[Company Agent] Error: Únicamente se permiten pagos en USDT.");
        return;
    }

    console.log(`[Company Agent] Requerimiento validado con éxito para ${employee_id}. Procesando transferencia...`);

    // 2. Ejecutar el pago programáticamente utilizando WDK CLI
    try {
        // Ejecutamos 'wdk send' de forma segura
        // El comando 'wdk send' genera el envío del token USDT hacia la wallet del empleado
        const wdkCommand = `wdk send --to ${wallet} --amount ${amount} --asset USDT --json`;
        console.log(`[Company Agent] Ejecutando: ${wdkCommand}`);
        
        const txOutput = execSync(wdkCommand).toString();
        const txResult = JSON.parse(txOutput);

        console.log(`[Company Agent] ¡Pago completado con éxito!`);
        console.log(`[Company Agent] Hash de Transacción: ${txResult.txHash || "Simulado-OK"}`);

        // Eliminar el requerimiento procesado para evitar doble pago
        fs.unlinkSync(requestPath);

    } catch (error) {
        console.error("[Company Agent] Error crítico al ejecutar el pago con WDK:", error.message);
    }
}

// Ejecutar el proceso de escucha del agente de la empresa
setInterval(processPaymentRequirement, 5000);
🚀 Dirección de Mejora: ¡Hazlo Sin Gas! (Track 2 Bonus)
Dado que estás implementando pagos de salarios, a tus empleados no les gustará tener que comprar saldo de la red nativa (como ETH o SOL) para poder mover sus salarios
.
Puedes aprovechar los módulos gasless de WDK (como wdk-wallet-solana-gasless o wdk-wallet-evm-erc-4337)
. Esto permitirá que las tarifas de gas de las transacciones se paguen directamente utilizando los mismos USD₮ que envías, o que sean patrocinadas por la empresa mediante un paymaster
.
📊 ¿Quieres que diseñemos un tablero de control en formato PDF para que la empresa pueda visualizar el historial de nóminas pagadas y los balances consumidos antes de que empieces a programar en tu máquina local?