/* global localStorage */
/**
 * @fileoverview Paygent i18n Engine (Internationalization)
 * Idioma Primario: Español (ES)
 * Idioma Secundario: Inglés (EN)
 */

const TRANSLATIONS = {
  es: {
    // Nav
    nav_overview: "Resumen / Cockpit",
    nav_treasury: "Tesorería de Empresa",
    nav_employees: "Agentes Empleados",
    nav_policy: "Motor de Políticas WDK",
    nav_logs: "Registros de Auditoría x402",
    nav_network_title: "Ethereum Sepolia",
    nav_network_subtitle: "USD₮ WDK No Custodial",
    nav_exit_home: "Salir / Volver a la Landing",

    // Header
    header_subtitle: "Cockpit Autónomo de Tesorería",
    header_policy_active: "Motor de Políticas: ACTIVO",

    landing_nav_how: "Cómo Funciona",
    landing_nav_sandbox: "Simulador en Vivo",
    landing_nav_arch: "Arquitectura",
    landing_nav_team: "Equipo",
    landing_nav_launch: "Lanzar Cockpit",

    landing_team_badge: "TALENTO E INGENIERÍA",
    landing_team_title: "Equipo Core de Desarrollo",
    landing_team_subtitle:
      "Ingeniería, producto y diseño construyendo la infraestructura de nómina autónoma con Tether WDK.",

    landing_hero_badge: "LA ERA DE LA NÓMINA AUTÓNOMA",
    landing_hero_title: "Nómina Autónoma para la Economía de Agentes",
    landing_hero_subtitle:
      "Liquidación de salarios de máquina a máquina gobernada por Tether WDK Policy Engine, protocolo puro x402 y USD₮ no custodial en Ethereum Sepolia.",
    landing_btn_cockpit: "🚀 Lanzar Cockpit Autónomo",
    landing_btn_sandbox: "⚡ Probar Simulador en Vivo",

    landing_stat_liquidity: "Liquidez en Tesorería",
    landing_stat_latency: "Latencia de Acuerdo",
    landing_stat_friction: "Intervención Humana",
    landing_stat_custody: "No Custodial",

    landing_agent_company_title: "Agente Empresa",
    landing_agent_company_role: "Tesorería No Custodial · WDK Policy Engine",
    landing_agent_employee_title: "Agente Empleado",
    landing_agent_employee_role: "Desarrollador Autónomo · Emisor x402",
    landing_synapse_label: "Protocolo de Pago RFC x402 (HTTP 402 + X-PAYMENT)",

    landing_problem_badge: "EL PARADIGMA AGÉNTICO",
    landing_problem_title:
      "¿Por qué los Agentes de IA no pueden usar bancos tradicionales?",
    landing_problem_desc:
      "Las finanzas tradicionales requieren identidad humana (DNI, SSN, KYC presencial). Los agentes de IA necesitan soberanía no custodial, interoperabilidad de máquina a máquina y gobernanza programable con USD₮.",
    landing_card_legacy_title: "Finanzas Tradicionales (Legacy)",
    landing_card_legacy_item1: "Requiere DNI / SSN y KYC humano presencial",
    landing_card_legacy_item2:
      "Fricción de 48-72 horas hábiles para liquidación",
    landing_card_legacy_item3: "Cuentas bancarias congelables por terceros",
    landing_card_paygent_title: "Paygent (Tether WDK + x402)",
    landing_card_paygent_item1:
      "Billeteras HD no custodiales (BIP-39 en memoria)",
    landing_card_paygent_item2: "Liquidación instantánea en segundos con USD₮",
    landing_card_paygent_item3: "Gobernanza Default-Deny con WDK Policy Engine",

    landing_how_title: "Cómo Funciona: Flujo de Acuerdo en 4 Fases",
    landing_how_subtitle:
      "De la detección temporal autónoma al recibo criptográfico inmutable on-chain",
    landing_how_step1_title: "1. Detección de Fecha (Día 1)",
    landing_how_step1_desc:
      "El Scheduler despierta autónomamente al agente en el día pactado en su contrato.",
    landing_how_step2_title: "2. Requerimiento x402",
    landing_how_step2_desc:
      "El agente empleado emite la cabecera HTTP 402 y el payload firmado X-PAYMENT.",
    landing_how_step3_title: "3. Pre-Flight WDK Policy",
    landing_how_step3_desc:
      "La empresa simula con account.simulate.transfer verificando lista blanca y topes.",
    landing_how_step4_title: "4. Liquidación On-Chain USD₮",
    landing_how_step4_desc:
      "Se emite la transferencia en Sepolia y se devuelve el recibo X-PAYMENT-RESPONSE con enlace a Etherscan.",

    landing_sandbox_title: "Sandbox Interactivo en Vivo",
    landing_sandbox_subtitle:
      "Prueba en tiempo real cómo el WDK Policy Engine aprueba cobros válidos y bloquea exploits",
    landing_sandbox_btn_alice: "⚡ Disparar Reclamo Válido (Alice: 2,500 USD₮)",
    landing_sandbox_btn_threat:
      "🛑 Simular Ataque Malicioso (Hacker: 10,000 USD₮)",

    landing_arch_title: "Arquitectura Modular Tether WDK",
    landing_arch_subtitle:
      "Diseñado para máxima extensibilidad, soberanía no custodial y compatibilidad multi-cadena",

    landing_jury_title: "Showcase para el Jurado de Aleph Hackathon",
    landing_jury_tests: "174 Tests Automatizados Pasando al 100%",
    landing_jury_network: "Red: Ethereum Sepolia Testnet (USD₮)",
    landing_jury_track: "Pista 1: Tether WDK Integration ($1,000 USDt)",

    // Scheduler & Time Warp Bar
    scheduler_title: "Motor de Programación y Simulación Temporal (Time Warp)",
    scheduler_standby: "EN ESPERA (ESPERANDO DÍA 1)",
    scheduler_active: "DÍA DE PAGO ACTIVO (DÍA 1)",
    scheduler_clock_label: "📅 Reloj Simulado:",
    scheduler_payday_label: "⏰ Pago Programado:",
    scheduler_payday_value: "Día 1 de cada mes (9:00 AM)",
    scheduler_btn_fast_forward: "Adelantar al Día 1 (Disparar Scheduler)",
    scheduler_btn_reset: "Reiniciar reloj al día de hoy",

    // KPI Cards
    kpi_liquidity_title: "Liquidez en Tesorería",
    kpi_liquidity_sub: "Sepolia Testnet No Custodial",
    kpi_settled_title: "Volumen Liquidado",
    kpi_settled_badge: "LIQUIDADO",
    kpi_settled_sub: "Ciclos automáticos de nómina",
    kpi_pending_title: "Reclamos x402 Pendientes",
    kpi_pending_badge: "ESPERANDO_CICLO",
    kpi_pending_sub: "Siguiente: Ejecución programada Día 1",
    kpi_agents_title: "Agentes Activos",
    kpi_agents_nodes: "Nodos Autónomos",
    kpi_agents_sub: "100% Sincronización WDK",

    // Split Cockpit: Left Panel (Treasury Guard)
    panel_treasury_title: "Tesorería Corporativa & Guardián WDK",
    panel_treasury_enforcement: "ENFORCEMENT EN VIVO",
    panel_budget_title: "Presupuesto Mensual de Nómina",
    panel_budget_allocated: "Asignado",
    panel_budget_reserve: "Reserva de Liquidez",
    panel_rules_title: "Reglas WDK Aplicadas",
    rule_whitelist: "Regla: Solo Lista Blanca (Activa)",
    rule_cap: "Regla: Máx. 5,000 USD₮ / tx (Aplicada)",
    rule_default_deny: "Regla: Default-Deny para Ops Desconocidas",
    sim_box_title: "Simulación Pre-Flight de Políticas WDK",
    sim_box_ready: "account.simulate.transfer: LISTO",
    sim_box_standby:
      "[EN ESPERA] Aguardando requerimiento entrante de pago de agente...",

    // Split Cockpit: Right Panel (Employee Claim Station)
    panel_claim_title: "Estación de Reclamos del Agente Empleado",
    emp_role_alice: "Desarrolladora Senior Core · 2,500 USD₮ / mes",
    emp_status_label: "Estado",
    emp_status_ready: "LISTO_PARA_COBRAR",
    emp_status_paid: "PAGO_CONFIRMADO",
    btn_trigger_claim: "Disparar Reclamo x402",
    btn_simulate_threat: "Simular Amenaza / Ataque",
    payload_preview_title: "Requerimiento x402 & Recibo",

    // 5-Stage Pipeline
    pipeline_title: "Inspector del Protocolo de Liquidación (Flujo en 5 Fases)",
    pipeline_subtitle: "Handshake Autónomo entre Agentes en Sepolia",
    step1_title: "1. Fecha de Cobro Detectada",
    step1_desc: "Disparo de Día 1 por Scheduler",
    step2_title: "2. Requerimiento x402 Emitido",
    step2_desc: "HTTP 402 + Cabecera X-PAYMENT",
    step3_title: "3. Simulación de Política WDK",
    step3_desc: "ALLOW (Lista Blanca & Tope)",
    step4_title: "4. Transferencia USD₮ Emitida",
    step4_desc: "Ethereum Sepolia Testnet",
    step5_title: "5. Recibo Validado",
    step5_awaiting: "Aguardando Liquidación",

    // Analytics & Ledger
    analytics_title: "Volumen Liquidado vs Pendiente",
    analytics_legend_settled: "Liquidado",
    analytics_legend_pending: "Pendiente",
    ledger_title: "Libro Contable de Liquidaciones Autónomas",
    ledger_subtitle: "Eventos Verificados On-Chain",
    th_timestamp: "Marca Temporal",
    th_agent_id: "ID de Agente",
    th_concept: "Concepto",
    th_amount: "Monto",
    th_policy_decision: "Decisión de Política",
    th_status: "Estado",
    th_tx_hash: "Hash Tx (Sepolia)",

    // Treasury Page
    treasury_page_title: "Bóveda de Tesorería y Reservas de Gas",
    btn_deposit_funds: "Depositar Fondos",
    vault_title: "Bóveda Corporativa Multichain",
    vault_sepolia_label: "Bóveda Ethereum Sepolia (Principal)",
    vault_ton_label: "Bóveda TON Testnet (Secundaria)",
    vault_gas_reserve: "Reserva de Gas (Sepolia ETH)",

    // Employees Page
    employees_page_title: "Registro de Agentes Empleados Autónomos",
    btn_batch_payroll: "⚡ Ejecutar Nómina Día 1 (Todos)",
    btn_add_agent: "Agregar Agente",
    salary_label: "Salario:",
    payday_label: "Día de Cobro:",
    address_label: "Dirección:",

    // Policy Page
    policy_page_title: "Motor de Políticas WDK y Reglas de Gobernanza",
    policy_status_banner: "Modo Default-Deny Activo",
    btn_simulate_policy: "Ejecutar Simulación en Sandbox",

    // Logs Page
    logs_page_title: "Registros Criptográficos de Auditoría x402",
    logs_subtitle: "Verificación Inmutable de Recibos X-PAYMENT-RESPONSE",
    modal_receipt_title: "Recibo Criptográfico de Reclamo x402",
    btn_close: "Cerrar",

    // Language Toggle
    lang_label: "Idioma",
    lang_es: "Español",
    lang_en: "English",
  },
  en: {
    // Nav
    nav_overview: "Overview / Cockpit",
    nav_treasury: "Company Treasury",
    nav_employees: "Employee Agents",
    nav_policy: "WDK Policy Engine",
    nav_logs: "x402 Audit Logs",
    nav_network_title: "Ethereum Sepolia",
    nav_network_subtitle: "USD₮ Non-Custodial WDK",
    nav_exit_home: "Exit / Back to Home",

    // Header
    header_subtitle: "Autonomous Treasury Cockpit",
    header_policy_active: "Policy Engine: ACTIVE",

    landing_nav_how: "How It Works",
    landing_nav_security: "WDK Security",
    landing_nav_sandbox: "Live Sandbox",
    landing_nav_arch: "Architecture",
    landing_nav_team: "Team",
    landing_nav_launch: "Launch Cockpit",

    landing_team_badge: "TALENT & ENGINEERING",
    landing_team_title: "Core Development Team",
    landing_team_subtitle:
      "Engineering, product, and design building autonomous payroll infrastructure with Tether WDK.",

    landing_hero_badge: "THE AUTONOMOUS PAYROLL EPOCH",
    landing_hero_title: "Autonomous Payroll for the Agentic Economy",
    landing_hero_subtitle:
      "Machine-to-machine salary settlement governed by Tether WDK Policy Engine, pure x402 protocol, and non-custodial USD₮ on Ethereum Sepolia.",
    landing_btn_cockpit: "🚀 Launch Cockpit",
    landing_btn_sandbox: "⚡ Try Live Simulator",

    landing_stat_liquidity: "Treasury Liquidity",
    landing_stat_latency: "Settlement Latency",
    landing_stat_friction: "Human Friction",
    landing_stat_custody: "Non-Custodial",

    landing_agent_company_title: "Company Agent",
    landing_agent_company_role: "Non-Custodial Treasury · WDK Policy Engine",
    landing_agent_employee_title: "Employee Agent",
    landing_agent_employee_role: "Autonomous Developer · x402 Emitter",
    landing_synapse_label: "RFC x402 Payment Protocol (HTTP 402 + X-PAYMENT)",

    landing_problem_badge: "THE AGENTIC SHIFT",
    landing_problem_title: "Why AI Agents Cannot Use Legacy Banks",
    landing_problem_desc:
      "Traditional finance demands human identity (ID, SSN, physical KYC). AI agents need non-custodial sovereignty, machine-to-machine interoperability, and programmable USD₮ governance.",
    landing_card_legacy_title: "Legacy Banking",
    landing_card_legacy_item1: "Requires human ID/SSN and in-person KYC",
    landing_card_legacy_item2: "48-72 business hour delays for settlement",
    landing_card_legacy_item3:
      "Freezable bank accounts by centralized entities",
    landing_card_paygent_title: "Paygent (Tether WDK + x402)",
    landing_card_paygent_item1: "Non-custodial HD Wallets (in-memory BIP-39)",
    landing_card_paygent_item2: "Instant settlement in seconds with USD₮",
    landing_card_paygent_item3: "Default-Deny governance via WDK Policy Engine",

    landing_how_title: "How It Works: 4-Stage Settlement Flow",
    landing_how_subtitle:
      "From autonomous scheduled trigger to immutable on-chain cryptographic receipt",
    landing_how_step1_title: "1. Due Date Detection (Day 1)",
    landing_how_step1_desc:
      "The Scheduler autonomously wakes the agent on the contracted payday.",
    landing_how_step2_title: "2. x402 Requirement",
    landing_how_step2_desc:
      "The employee agent emits the HTTP 402 header and signed X-PAYMENT payload.",
    landing_how_step3_title: "3. Pre-Flight WDK Policy",
    landing_how_step3_desc:
      "The company simulates with account.simulate.transfer verifying whitelist & caps.",
    landing_how_step4_title: "4. On-Chain USD₮ Settlement",
    landing_how_step4_desc:
      "The Sepolia transfer executes and returns an X-PAYMENT-RESPONSE receipt with Etherscan link.",

    landing_sandbox_title: "Live Interactive Sandbox",
    landing_sandbox_subtitle:
      "Test in real time how the WDK Policy Engine approves legitimate claims and blocks exploits",
    landing_sandbox_btn_alice: "⚡ Trigger Valid Claim (Alice: 2,500 USD₮)",
    landing_sandbox_btn_threat:
      "🛑 Simulate Exploit Attempt (Hacker: 10,000 USD₮)",

    landing_arch_title: "Tether WDK Modular Architecture",
    landing_arch_subtitle:
      "Engineered for maximum extensibility, non-custodial sovereignty, and multi-chain support",

    landing_jury_title: "Aleph Hackathon Jury Showcase",
    landing_jury_tests: "174 Automated Tests Passing at 100%",
    landing_jury_network: "Network: Ethereum Sepolia Testnet (USD₮)",
    landing_jury_track: "Track 1: Tether WDK Integration ($1,000 USDt)",

    // Scheduler & Time Warp Bar
    scheduler_title: "Payroll Scheduler & Time Warp Engine",
    scheduler_standby: "STANDBY (AWAITING DAY 1)",
    scheduler_active: "PAYDAY ACTIVE (DAY 1)",
    scheduler_clock_label: "📅 Simulated Clock:",
    scheduler_payday_label: "⏰ Scheduled Payday:",
    scheduler_payday_value: "Day 1 of each month (9:00 AM)",
    scheduler_btn_fast_forward: "⚡ Fast-Forward to Day 1 (Trigger Scheduler)",
    scheduler_btn_reset: "Reset clock to today",

    // KPI Cards
    kpi_liquidity_title: "Treasury Liquidity",
    kpi_liquidity_sub: "Sepolia Testnet Non-Custodial",
    kpi_settled_title: "Settled Volume",
    kpi_settled_badge: "SETTLED",
    kpi_settled_sub: "Automated payroll cycles",
    kpi_pending_title: "Pending x402 Claims",
    kpi_pending_badge: "AWAITING_CYCLE",
    kpi_pending_sub: "Next: Day 1 Scheduled Run",
    kpi_agents_title: "Active Agents",
    kpi_agents_nodes: "Autonomous Nodes",
    kpi_agents_sub: "100% WDK Handshake",

    // Split Cockpit: Left Panel (Treasury Guard)
    panel_treasury_title: "Company Treasury & WDK Policy Guard",
    panel_treasury_enforcement: "LIVE ENFORCEMENT",
    panel_budget_title: "Monthly Payroll Budget",
    panel_budget_allocated: "Allocated",
    panel_budget_reserve: "Liquidity Reserve",
    panel_rules_title: "Enforced WDK Rules",
    rule_whitelist: "Rule: Whitelist Only (Active)",
    rule_cap: "Rule: Max 5,000 USD₮ / tx (Enforced)",
    rule_default_deny: "Rule: Default-Deny for Unknown Ops",
    sim_box_title: "WDK Policy Pre-Flight Simulation",
    sim_box_ready: "account.simulate.transfer: READY",
    sim_box_standby:
      "[STANDBY] Waiting for incoming agent payment requirement...",

    // Split Cockpit: Right Panel (Employee Claim Station)
    panel_claim_title: "Employee Agent Claim Station",
    emp_role_alice: "Senior Core Dev · 2,500 USD₮ / mo",
    emp_status_label: "Status",
    emp_status_ready: "READY_TO_CLAIM",
    emp_status_paid: "PAID_CONFIRMED",
    btn_trigger_claim: "Trigger x402 Claim",
    btn_simulate_threat: "Simulate Exploit",
    payload_preview_title: "x402 Requirement & Receipt",

    // 5-Stage Pipeline
    pipeline_title: "Settlement Protocol Inspector (5-Stage Flow)",
    pipeline_subtitle: "Live Agent Handshake on Sepolia",
    step1_title: "1. Due Date Detected",
    step1_desc: "Day 1 Trigger by Scheduler",
    step2_title: "2. x402 Claim Emitted",
    step2_desc: "HTTP 402 + X-PAYMENT",
    step3_title: "3. WDK Policy Simulation",
    step3_desc: "ALLOW (Whitelist & Cap)",
    step4_title: "4. USD₮ Transfer Broadcast",
    step4_desc: "Ethereum Sepolia Testnet",
    step5_title: "5. Receipt Validated",
    step5_awaiting: "Awaiting Settlement",

    // Analytics & Ledger
    analytics_title: "Settled vs Pending Volume",
    analytics_legend_settled: "Settled",
    analytics_legend_pending: "Pending",
    ledger_title: "Autonomous Agent Settlement Ledger",
    ledger_subtitle: "Verified On-Chain Events",
    th_timestamp: "Timestamp",
    th_agent_id: "Agent ID",
    th_concept: "Concept",
    th_amount: "Amount",
    th_policy_decision: "Policy Decision",
    th_status: "Status",
    th_tx_hash: "Tx Hash (Sepolia)",

    // Treasury Page
    treasury_page_title: "Treasury Vault & Gas Reserves",
    btn_deposit_funds: "Deposit Funds",
    vault_title: "Multichain Corporate Vault",
    vault_sepolia_label: "Ethereum Sepolia Vault (Primary)",
    vault_ton_label: "TON Testnet Vault (Secondary)",
    vault_gas_reserve: "Gas Reserve (Sepolia ETH)",

    // Employees Page
    employees_page_title: "Autonomous Employee Agents Registry",
    btn_batch_payroll: "⚡ Run Day 1 Payroll (All Agents)",
    btn_add_agent: "Add Agent",
    salary_label: "Salary:",
    payday_label: "Payday:",
    address_label: "Address:",

    // Policy Page
    policy_page_title: "WDK Policy Engine & Governance Rules",
    policy_status_banner: "Default-Deny Mode Active",
    btn_simulate_policy: "Run Sandbox Simulation",

    // Logs Page
    logs_page_title: "Cryptographic x402 Audit Logs",
    logs_subtitle: "Immutable X-PAYMENT-RESPONSE Receipt Verification",
    modal_receipt_title: "Cryptographic x402 Claim Receipt",
    btn_close: "Close",

    // Language Toggle
    lang_label: "Idioma",
    lang_es: "Español",
    lang_en: "English",
  },
};

// Global i18n Manager
window.PaygentI18n = {
  currentLang: localStorage.getItem("paygent_lang") || "es",

  t(key) {
    const lang = this.currentLang;
    return (
      (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ||
      TRANSLATIONS.es[key] ||
      key
    );
  },

  setLanguage(lang) {
    if (lang !== "es" && lang !== "en") lang = "es";
    this.currentLang = lang;
    localStorage.setItem("paygent_lang", lang);
    this.applyTranslations();
    this.updateSwitcherUI();
  },

  toggleLanguage() {
    const newLang = this.currentLang === "es" ? "en" : "es";
    this.setLanguage(newLang);
  },

  applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        const text = this.t(key);
        if (el.tagName === "INPUT" && el.type === "placeholder") {
          el.placeholder = text;
        } else {
          el.innerText = text;
        }
      }
    });
  },

  renderSwitcher(containerElement) {
    if (!containerElement) return;
    const isEs = this.currentLang === "es";
    containerElement.innerHTML = `
      <div class="inline-flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono-tech">
        <button onclick="window.PaygentI18n.setLanguage('es')" 
                title="Español"
                class="px-2.5 py-1 rounded-lg font-bold transition-all ${isEs ? "bg-[#2DD4BF] text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}">
          ES
        </button>
        <button onclick="window.PaygentI18n.setLanguage('en')" 
                title="English"
                class="px-2.5 py-1 rounded-lg font-bold transition-all ${!isEs ? "bg-[#2DD4BF] text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}">
          EN
        </button>
      </div>
    `;
  },

  updateSwitcherUI() {
    const container = document.getElementById("langSwitcherContainer");
    if (container) {
      this.renderSwitcher(container);
    }
    const topContainer = document.getElementById("topLangSwitcher");
    if (topContainer) {
      this.renderSwitcher(topContainer);
    }
  },

  init() {
    const container = document.getElementById("langSwitcherContainer");
    if (container) {
      this.renderSwitcher(container);
    }
    const topContainer = document.getElementById("topLangSwitcher");
    if (topContainer) {
      this.renderSwitcher(topContainer);
    }
    this.applyTranslations();
  },
};

// Auto initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    window.PaygentI18n.init(),
  );
} else {
  window.PaygentI18n.init();
}
