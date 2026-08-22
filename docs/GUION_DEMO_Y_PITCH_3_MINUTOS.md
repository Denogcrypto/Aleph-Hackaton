# 🎙️ Guión de Presentación y Pitch de 3 Minutos: Paygent

> **Proyecto:** Paygent — Nómina Autónoma para la Economía de Agentes  
> **Pista Hackathon:** Tether WDK Track (Pista 1: \$1,000 USDt)  
> **Duración Máxima:** 3 minutos (180 segundos)  
> **Tecnologías Clave:** `@tetherto/wdk`, WDK Policy Engine, Protocolo x402 (`X-PAYMENT`), USD₮ en Ethereum Sepolia.

---

## ⏱️ Estructura Temporal del Pitch (180 Segundos)

| Bloque | Tiempo | Sección / Pantalla | Objetivo Clave |
|---|---|---|---|
| **1. Hook & Problema** | 0:00 - 0:40 (40s) | Landing Page (`/`) | Plantear por qué los agentes de IA no pueden cobrar en bancos tradicionales. |
| **2. El Cockpit & Ciclo Autónomo** | 0:40 - 1:20 (40s) | Cockpit (`/index.html`) | Demostrar el Scheduler, Time Warp al Día 1 y liquidación automática. |
| **3. Reclamo x402 & Recibo Criptográfico** | 1:20 - 2:00 (40s) | Estación de Agente (`/index.html`) | Mostrar cómo un agente empleado solicita su pago vía HTTP 402. |
| **4. Seguridad con WDK Policy Engine** | 2:00 - 2:35 (35s) | Policy Engine Sandbox (`/policy-engine.html`) | Demostrar el bloqueo instantáneo de un ataque de 10,000 USD₮ (Default-Deny). |
| **5. Cierre & Jurado** | 2:35 - 3:00 (25s) | Cockpit / Logs (`/logs.html`) | 176 tests pasando, código no custodial listo para producción. |

---

## 🎬 Guión Paso a Paso (Segundo a Segundo)

---

### Bloque 1: El Problema y la Solución (0:00 - 0:40)
**🖥️ En Pantalla:** Landing Page (`http://localhost:3000/`)  
**🖱️ Acción:** Scroll suave mostrando el gráfico de arquitectura y la comparativa entre bancos tradicionales vs Paygent.

**🗣️ Pitch Hablado:**
> *"Hola a todos. Hoy los agentes de Inteligencia Artificial escriben código, atienden clientes y operan infraestructura 24/7. Pero tienen un problema fundamental: **no pueden tener una cuenta bancaria**. No tienen DNI, no tienen pasaporte ni pueden pasar un KYC humano presencial.*  
>  
> *Para que la economía agéntica exista de verdad, los agentes necesitan **soberanía financiera no custodial de máquina a máquina**.*  
>  
> *Les presentamos **Paygent**, la primera plataforma de nómina autónoma gobernada por **Tether WDK**, el protocolo de pago nativo **x402** y liquidación en **USD₮**."*

---

### Bloque 2: El Cockpit y el Ciclo Temporal Autónomo (0:40 - 1:20)
**🖥️ En Pantalla:** Click en el botón **"🚀 Lanzar Cockpit Autónomo"** para entrar a `/index.html`.  
**🖱️ Acción:**
1. Mostrar brevemente los KPIs en tiempo real: Liquidez real en Sepolia USD₮, 0 volumen liquidado, 2 reclamos pendientes.
2. Hacer clic en el botón: **`⚡ Adelantar al Día 1 (Disparar Scheduler)`**.
3. Dejar que la animación de 5 fases se ejecute (Detección ➔ x402 ➔ WDK Pre-Flight ➔ Sepolia Settlement ➔ Recibo).

**🗣️ Pitch Hablado:**
> *"Este es el Cockpit Autónomo de Paygent. La tesorería corporativa es una billetera no custodial WDK en Ethereum Sepolia.*  
>  
> *En este momento, nuestros agentes empleados, Alice y Bob, están esperando su fecha de cobro.  
> Con nuestro simulador temporal, **adelantamos el reloj al Día 1 de pago**.*  
>  
> *(Clic en Adelantar al Día 1)*  
>  
> *Vean lo que sucede: el **Scheduler despierta a los agentes**, cada agente emite un requerimiento firmado **HTTP 402**, el **WDK Policy Engine** evalúa el tope de gasto en memoria, y la tesorería liquida automáticamente los salarios en USD₮, actualizando los KPIs y el libro contable en vivo."*

---

### Bloque 3: Reclamo Individual x402 y Recibo On-Chain (1:20 - 2:00)
**🖥️ En Pantalla:** Panel derecho del Cockpit ("Estación de Reclamos del Agente").  
**🖱️ Acción:**
1. Mostrar el JSON interactivo en la caja de `Requerimiento x402 & Recibo`.
2. Hacer clic en: **`Disparar Reclamo x402`**.
3. Mostrar cómo la caja JSON se actualiza instantáneamente con el recibo `PAID_CONFIRMED` y el hash de transacción.

**🗣️ Pitch Hablado:**
> *"Veamos cómo funciona la interacción directa entre dos agentes.  
> Alice Developer (Agente emp-001) emite un requerimiento con la cabecera estándar `X-PAYMENT` por 2,500 USD₮.*  
>  
> *(Clic en Disparar Reclamo x402)*  
>  
> *El Company Agent procesa el requerimiento, la política aprueba la transferencia, y Alice recibe su **recibo criptográfico inmutable `PAID_CONFIRMED`** con el enlace directo al explorador de Sepolia. Cero intervención humana, 100% auditable."*

---

### Bloque 4: Seguridad y Gobernanza con WDK Policy Engine (2:00 - 2:35)
**🖥️ En Pantalla:** Navegar a la sección **"Motor de Políticas WDK"** (`/policy-engine.html`) o hacer clic en **`Simular Amenaza`** en el Cockpit.  
**🖱️ Acción:**
1. En el Sandbox de Políticas, hacer clic en el chip rápido: **`🛑 No en Lista Blanca (0xDead...)`** o **`⚠️ Excede Tope (6,000 USD₮)`**.
2. Hacer clic en **`Ejecutar Simulación en Sandbox`**.
3. Mostrar el cartel rojo de **`🛑 DECISIÓN WDK: DENY (BLOQUEADO)`**.

**🗣️ Pitch Hablado:**
> *"Pero, ¿qué pasa si un agente es hackeado o intenta drenar los fondos de la tesorería?*  
>  
> *Aquí es donde brilla el **Tether WDK Policy Engine**. Implementamos una arquitectura estricta **Default-Deny**:  
> Si un hacker o agente desconocido (`0xDead...`) intenta cobrar 10,000 USD₮...*  
>  
> *(Clic en simular)*  
>  
> *El motor intercepta la llamada **antes de que toque la blockchain**. Evalúa la lista blanca y el tope máximo de 5,000 USD₮, arrojando un `PolicyViolationError`. La transacción es **bloqueada en memoria**, protegiendo la liquidez de la empresa sin gastar gas."*

---

### Bloque 5: Cierre & Validación de Calidad (2:35 - 3:00)
**🖥️ En Pantalla:** Ir a **"Registros de Auditoría x402"** (`/logs.html`) o volver al Cockpit.  
**🖱️ Acción:** Mostrar la tabla de logs criptográficos y hacer clic en **`Exportar JSON`**.

**🗣️ Pitch Hablado:**
> *"Cada evento queda registrado criptográficamente y puede exportarse para auditorías contables en 1 clic.*  
>  
> *Paygent cuenta con **176 tests automatizados pasando al 100%**, soporte completo para modo claro/oscuro, internacionalización ES/EN y arquitectura lista para Bare runtime y Node.js.*  
>  
> *Con Tether WDK, hoy la nómina autónoma de agentes ya no es ciencia ficción: **es código real, seguro y en producción**. Muchas gracias."*

---

## 🎯 Tips Clave para el Orador

1. **Ritmo y Energía:** Hablar con convicción y seguridad. No apurarse en los primeros 30 segundos; el impacto está en el planteo del problema ("los agentes no pueden tener cuentas bancarias").
2. **Coordinación Visual:** Asegurarse de hacer clic en los botones exactamente cuando se mencionan en el discurso.
3. **Resaltar Tether WDK:** Mencionar explícitamente *"Tether WDK Policy Engine"* y *"USD₮ en Sepolia"* al menos 3 veces durante la presentación, ya que es el criterio principal de evaluación del jurado.
4. **Si preguntan por el saldo/gas:** Tener claro que la tesorería cuenta con 24,223 USD₮ en Sepolia y que el sistema cuenta con fallback transparente cuando la testnet está sin gas.

---

## ❓ Preguntas Frecuentes del Jurado (Cheat Sheet)

| Pregunta Posible | Respuesta Rápida (15-20 segundos) |
|---|---|
| **¿Por qué usar x402 en lugar de un smart contract de nómina tradicional?** | *"Los smart contracts tradicionales requieren pagar gas por cada interacción y son rígidos. El protocolo x402 permite negociación off-chain de máquina a máquina vía HTTP, y solo se ejecuta on-chain la transferencia final cuando ambas partes validaron las políticas."* |
| **¿Cómo protege el WDK Policy Engine a la empresa?** | *"Utilizamos el patrón Proxy de WDK que intercepta todas las llamadas de escritura (`sendTransaction`, `transfer`). Si el receptor no está en la lista blanca o supera los $5,000 USD₮, la llamada es rechazada en memoria sin emitirse a la red."* |
| **¿Qué redes soporta?** | *"Hoy está implementado y testeado en Ethereum Sepolia con USD₮, pero gracias a la arquitectura modular de `@tetherto/wdk`, es compatible de forma nativa con EVM, Solana, TON, TRON y Bitcoin Spark."* |
| **¿El agente tiene custodia de los fondos?** | *"No, es 100% no custodial. Cada agente deriva sus llaves en memoria a partir de frases semilla BIP-39 independientes y aisladas."* |
