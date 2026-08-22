---
title: "Hackatón de Aleph - Pista WDK"
source: "https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track"
domain: "hacki.crecimiento.build"
date: "2026-08-22 17:56:16"
---

# 🟧 Pista WDK - Hackatón de Aleph

Tether · puedes ingresar 1 pista de este patrocinador

# 🎯 Resumen

**WDK (Wallet Development Kit) de Tether** es un kit de herramientas de código abierto y sin custodia para crear **monederos y flujos de pago** en cualquier aplicación. En lugar de aprender un SDK diferente para cada cadena, obtienes una interfaz consistente para Bitcoin, Lightning, EVM, Solana, TON, TRON y más, además de módulos para **intercambios, puentes, préstamos** y conversión **de moneda fiduciaria**, con una experiencia web 2.0 fluida.

Todo es modular: instala solo las cadenas y protocolos que necesites, guarda las claves en el dispositivo del usuario y listo. Hay un SDK (Node.js, Bare, React Native), una **CLI** con un **servidor MCP** integrado para que los agentes de IA puedan gestionar una billetera y módulos **sin gas** que permiten a tus usuarios pagar las comisiones en USD₮ en lugar de mantener tokens de gas nativos.

**Si eres nuevo en el desarrollo de criptomonedas:** no necesitas escribir ni un solo contrato inteligente para ganar esta categoría. WDK gestiona las claves, las direcciones, los saldos y las transacciones; tú puedes centrarte en desarrollar el producto, ya sea para usuarios humanos o agentes.

# 🏆 Desglose de premios

Monto total de premios: Hasta 1.500 USD en premios, que se distribuirán a discreción del jurado en función del mérito, la calidad, la originalidad y el impacto de los proyectos presentados.

- 🥇 1er lugar — $1,000 USDt — Mejor proyecto creado con WDK CLI. Para proyectos que utilicen WDK CLI (y/o su servidor MCP incluido) como componente principal. Agentes con billeteras, flujos de pago programados, herramientas de billetera local, utilidades para desarrolladores… ¡Sorpréndenos!
- 🥈 2do lugar — $500 USDt — Mejor proyecto sin gas: Para proyectos que utilizan los módulos de billetera sin gas de WDK para que los usuarios puedan realizar transacciones sin tener que mantener gas nativo.

# 🧑💻 Enfoque de seguimiento

Elige una pista principal y profundiza en ella. A continuación, encontrarás algunos puntos de partida; las ideas originales son bienvenidas.

## 🥇 Pista 1: Compilación con la CLI de WDK

La CLI es una billetera local de línea de comandos: crea y desbloquea billeteras, deriva direcciones, consulta saldos e historial, envía activos y tokens nativos, administra redes y tokens personalizados, y genera enlaces de entrada/salida de MoonPay. También incluye `wdk-mcp` un servidor MCP que expone esas mismas operaciones de billetera a clientes compatibles con MCP (Claude Desktop, Claude Code, OpenClaw).

1. **Dale una billetera a un agente de IA.** Integra wdk mcp en un cliente MCP y crea un agente que consulte saldos, cotice y envíe USD₮ bajo restricciones definidas por el usuario (límites de gasto, listas de permitidos, solicitudes de confirmación). Se valorará positivamente un modelo de seguridad bien pensado.
2. **Tesorería y pagos automatizados.** Una herramienta de nómina, subvenciones o pago de recompensas basada en shell: lee un archivo CSV, previsualiza cada transferencia con `wdk send`, ejecuta por lotes y genera un registro de recibos utilizando `--json` la salida.
3. **Herramientas para comercios/facturación.** Un terminal POS o verificador de facturas que monitorea una dirección `wdk get`, detecta pagos entrantes en USD₮ y activa un webhook o imprime un recibo.
4. **Utilidades para desarrolladores.** Un bot de faucet, un asistente de operaciones de testnet, una interfaz de usuario de portafolio o una tarea de integración continua que utiliza la CLI como backend de su billetera.
5. **Pagos de agentes.** Combine el servidor CLI/MCP con [x402](https://docs.wdk.tether.io/ai/x402/) para que un agente pueda pagar por cada llamada a la API.

## 🥈 Pista 2 — Construye algo sin gas

Los módulos sin gas permiten a los usuarios realizar transacciones sin necesidad de poseer gas nativo: las comisiones las paga un pagador y se liquidan en **USD₮ o USD₮0**, o bien, las financia usted en su totalidad.

1. **Proceso de incorporación sin saldo inicial.** El usuario llega con la cartera vacía, recibe USD₮ y puede enviarlo inmediatamente; sin necesidad de comprar SOL primero. Se muestra la cotización de la comisión en USD₮ antes de firmar.
2. **EIP-7702: Actualiza la EOA que ya tienen los usuarios.** Mantén la misma dirección, delega la ejecución y ejecuta las transacciones como UserOperations ERC-4337 patrocinadas. Ideal para el procesamiento por lotes (aprobación + intercambio en una sola operación) o para mecanismos de crecimiento como "tus primeras 10 transacciones corren por nuestra cuenta".
3. **Remesas Solana o pagos P2P.** Utilice el módulo Solana sin gas (pagador compatible con Kora) para transferencias SPL/USD₮ donde la cuenta de token asociada del destinatario se crea automáticamente.
4. **Suscripciones, propinas o economías dentro del juego.** Pagos recurrentes o de microvalor donde cobrarle al usuario gas perjudicaría la experiencia de usuario.
5. **Flujos sin gas entre cadenas.** Combinar una billetera sin gas con el [puente USDT0](https://docs.wdk.tether.io/sdk/bridge-modules/bridge-usdt0-evm/) o un módulo de intercambio para que todo el proceso nunca afecte al gas nativo.

**Lo que vamos a analizar:**
- ¿Resuelve un problema real del usuario?
- ¿Funciona realmente de principio a fin en la demostración?
- ¿La integración con WDK es significativa (no es un envoltorio para una sola llamada)?
- ¿La experiencia de usuario es algo que podría usar una persona sin conocimientos de criptografía, o un agente?

# 🛠️ Requisitos técnicos

**Debe utilizarse:**
- **WDK** como dependencia principal de su proyecto: `@tetherto/wdk`
- **Pista 1:** `@tetherto/wdk-cli` (el paquete con ámbito; el paquete sin ámbito `wdk-cli` en npm es un proyecto diferente).
- **Pista 2:** al menos un módulo de billetera sin gas WDK (`wdk-wallet-solana-gasless`, `wdk-wallet-evm-7702-gasless`, `wdk-wallet-evm-erc-4337`, `wdk-wallet-ton-gasless`, o `wdk-wallet-tron-gasfree`). Y token de gas USD₮.

**Ambiente:**
- Node.js **22.18.0 o posterior**.
- Los paquetes WDK se encuentran actualmente en **fase beta**. Utilice una billetera de prueba dedicada con fondos limitados; nunca una billetera personal con dinero real.

### Configuración del pagador (Pista 2)
No proporcionamos puntos finales de pago para el hackathon; cada **participante** obtiene el suyo propio, y es rápido. Proveedores como **Candide** y **Pimlico** ofrecen un punto final en pocos minutos desde sus paneles de control. La página de documentación de cada módulo sin gas detalla exactamente lo que necesita (RPC, URL del empaquetador, URL del pagador, token del pagador y, para EIP-7702, una dirección de delegación), y las publicaciones específicas para cada cadena en el [blog de WDK](https://wdk.tether.io/blog) explican la configuración cadena por cadena.

**Red de prueba frente a red principal:**
- La red de prueba USD₮ solo está disponible en **Sepolia**, a través de Candide y Pimlico. Si estás desarrollando en Sepolia, no tendrás problemas.
- Para **cualquier otra cadena** (Solana, TON, TRON, otras EVM), implemente su propio **token ficticio USD₮** y configure el paymaster para que apunte a él. **No** utilice el token de otra plataforma de criptomonedas estables, ya que no será aceptado.
- O bien, trabajar en la red principal con pequeñas cantidades.

### Reutilización de código
- **Puedes reutilizar el código existente.** Solo evaluaremos lo que hayas creado durante el hackathon.
- **La integración del WDK en sí debe ser nueva**, escrita este fin de semana.
- **No añadas WDK en paralelo.** Si encontramos un proyecto que ya tiene su propia capa de monedero/pago y simplemente le ha añadido WDK para obtener el premio, lo descartaremos. La integración debe aportar algo real a tu producto.

### Codificación asistida por IA
Está totalmente permitido, e incluso lo recomendamos, enviar herramientas específicas para ello:
- [Construye con IA](https://docs.wdk.tether.io/start-building/build-with-ai/)
- [Kit de herramientas MCP](https://docs.wdk.tether.io/ai/mcp-toolkit/)
- [Habilidades del agente](https://docs.wdk.tether.io/ai/agent-skills/)
- [OpenClaw](https://docs.wdk.tether.io/ai/openclaw/)
- [x402](https://docs.wdk.tether.io/ai/x402/)

**Pero revisa lo que escribe tu modelo:** Las integraciones de WDK solo requieren unas pocas líneas de código; los modelos tienden a complicarlas demasiado, inventar métodos que no existen y generar configuraciones arbitrarias. **Los errores evidentes de la IA** (API inventadas, código obsoleto, un archivo README que describe funciones inexistentes) **se descartan sin revisión**. Usa las Habilidades del Agente y la documentación para mantener el código basado en la API real.

### La presentación debe incluir
- **Repositorio público** con un archivo README que explica qué has creado y qué módulos del WDK has utilizado.
- **Enlaces permanentes a la integración de WDK**, enlaces directos de GitHub a los archivos/líneas específicos donde se utiliza WDK.
- **Vídeo de demostración grabado** (asíncrono) que muestra el flujo en funcionamiento.
- **Lista de paquetes y versiones de WDK** que ha instalado.
- **Instrucciones de configuración** que funcionan desde una clonación limpia: pasos de instalación, `.env.example` con las variables que necesita (RPC, bundler, paymaster, direcciones de token) y el comando para ejecutarlo.
- **Detalles de la red y del token**, en qué cadena realizó la demostración y, si implementó un USD₮ simulado, su dirección de contrato.

# 📚 Recursos para desarrolladores

**Empieza aquí**
- Página principal de la documentación: [https://docs.wdk.tether.io](https://docs.wdk.tether.io/)
- Inicio rápido de Node.js y Bare: [https://docs.wdk.tether.io/start-building/nodejs-bare-quickstart/](https://docs.wdk.tether.io/start-building/nodejs-bare-quickstart/)
- Inicio rápido de React Native: [https://docs.wdk.tether.io/start-building/react-native-quickstart/](https://docs.wdk.tether.io/start-building/react-native-quickstart/)
- ¿Qué módulo de billetera necesito? [https://docs.wdk.tether.io/sdk/wallet-modules/which-wallet-module/](https://docs.wdk.tether.io/sdk/wallet-modules/which-wallet-module/)
- Conceptos y glosario: [https://docs.wdk.tether.io/resources/concepts/](https://docs.wdk.tether.io/resources/concepts/)

**Construyendo con IA**
- Construye con IA: [https://docs.wdk.tether.io/start-building/build-with-ai/](https://docs.wdk.tether.io/start-building/build-with-ai/)
- Kit de herramientas MCP: [https://docs.wdk.tether.io/ai/mcp-toolkit/](https://docs.wdk.tether.io/ai/mcp-toolkit/)
- Habilidades del agente: [https://docs.wdk.tether.io/ai/agent-skills/](https://docs.wdk.tether.io/ai/agent-skills/)
- OpenClaw: [https://docs.wdk.tether.io/ai/openclaw/](https://docs.wdk.tether.io/ai/openclaw/)
- x402: [https://docs.wdk.tether.io/ai/x402/](https://docs.wdk.tether.io/ai/x402/)

**Pista 1 — CLI**
- Descripción general de la CLI de WDK: [https://docs.wdk.tether.io/cli/](https://docs.wdk.tether.io/cli/)
- Para empezar: [https://docs.wdk.tether.io/cli/guides/get-started/](https://docs.wdk.tether.io/cli/guides/get-started/)
- Referencia de la API (todos los comandos): [https://docs.wdk.tether.io/cli/api-reference/](https://docs.wdk.tether.io/cli/api-reference/)
- Configuración: [https://docs.wdk.tether.io/cli/configuration/](https://docs.wdk.tether.io/cli/configuration/)
- Utilice el servidor MCP: [https://docs.wdk.tether.io/cli/guides/use-mcp-server/](https://docs.wdk.tether.io/cli/guides/use-mcp-server/)
- Modelo de seguridad: [https://docs.wdk.tether.io/cli/reference/security-model/](https://docs.wdk.tether.io/cli/reference/security-model/)

**Pista 2 — Sin gas**
- Solana sin gas: [https://docs.wdk.tether.io/sdk/wallet-modules/wallet-solana-gasless/](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-solana-gasless/)
- Cuentas EIP-7702: [https://docs.wdk.tether.io/sdk/wallet-modules/wallet-evm-7702-gasless/](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-evm-7702-gasless/)
- Cuentas inteligentes (ERC-4337): [https://docs.wdk.tether.io/sdk/wallet-modules/wallet-evm-erc-4337/](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-evm-erc-4337/)
- TON sin gas: [https://docs.wdk.tether.io/sdk/wallet-modules/wallet-ton-gasless/](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-ton-gasless/)
- TRON sin gas: [https://docs.wdk.tether.io/sdk/wallet-modules/wallet-tron-gasfree/](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-tron-gasfree/)
- Guías de configuración de Paymaster: [https://wdk.tether.io/blog](https://wdk.tether.io/blog)

**Comunidad y apoyo**
- Discord: [https://discord.gg/tetherdev](https://discord.gg/tetherdev)
- X / Twitter: [https://x.com/WDK_tether](https://x.com/WDK_tether)

# 💬 Contacto y Mentoría
- Raquel DevRel | Telegram: **@rraigal** y Twitter: **@rraigal_**
- Juez: Raquel DevRel
